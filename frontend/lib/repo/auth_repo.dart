// ignore_for_file: avoid_web_libraries_in_flutter

import 'dart:async';
import 'dart:convert';
import 'dart:html';

import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:health_care_website/config.dart';
import 'package:health_care_website/model/user/user.dart';
import 'package:health_care_website/util/cookie_manager.dart';
import 'package:uuid/uuid.dart';
import 'package:http/http.dart' as http;

abstract class AuthRepo {
  static set state(String value) => window.localStorage["state"] = value;
  static String get state => window.localStorage["state"].toString();

  static Uri get ncuPortalOAuthUrl {
    state = (const Uuid()).v4().toString();
    return Uri.https(Config.ncuPortal, "/oauth2/authorization", {
      "response_type": "code",
      "client_id": dotenv.get("NCU_PORTAL_CLIENT_ID"),
      "redirect_uri":
          Uri.https(Config.backend, "/api/auth/return-to").toString(),
      "scope": "identifier chinese-name",
      "state": state,
    });
  }

  static Future<String?> getAccessToken({bool? cookieOnly}) async {
    // get token from cookie
    String? token = CookieManager.get("token");
    if (cookieOnly == true) return token;

    // get token from oauth state
    final url = Uri.https(Config.backend, "/api/auth/token", {
      "state": state,
    });

    const int maxRetry = 20;
    int retried = 0;
    bool retryLock = false;
    final retryCompleter = Completer();

    Timer.periodic(const Duration(milliseconds: 200), (timer) async {
      if (retryLock) return;
      retryLock = true;
      try {
        final response = await http.get(url);
        if (response.statusCode != 200) throw Exception(response.body);
        token = json.decode(response.body)["response"]["access_token"];
        timer.cancel();
        retryCompleter.complete();
      } on Exception catch (e) {
        if (retried < maxRetry) {
          retried++;
          if (kDebugMode) print("retried $retried times at tick ${timer.tick}");
          return;
        }
        if (kDebugMode) print(e);
        timer.cancel();
        retryCompleter.complete();
      } finally {
        retryLock = false;
      }
    });
    await retryCompleter.future;
    CookieManager.set("token", token.toString(),
        DateTime.now().add(const Duration(days: 30)));
    return token;
  }

  static void forgetAccessToken() {
    CookieManager.clear("token");
  }

  static Future<User?> getUser() async {
    final url = Uri.https(Config.backend, "/api/auth");
    final token = await getAccessToken(cookieOnly: true);
    if (token == null) return null;
    try {
      final response = await http.get(url, headers: {
        "Authorization": "Bearer $token",
      });
      if (response.statusCode != 200) return null;
      return User.fromJson(json.decode(response.body)["response"]);
    } on Exception catch (e) {
      if (kDebugMode) print(e);
      return null;
    }
  }

  static Future<bool> isAuthorized() async => await getUser() != null;
}
