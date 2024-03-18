import 'dart:collection';
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:health_care_website/enum/post_column.dart';
import 'package:health_care_website/model/post/attachment_info.dart';
import 'package:health_care_website/model/post/post.dart';
import 'package:health_care_website/repo/post_repo.dart';

class PostEditPageViewModel with ChangeNotifier {
  Post? _post;
  Post? get post => _post;

  String _id = "";
  String get id => _id;

  List<AttachmentInfo> _attachments = [];
  List<AttachmentInfo> get attachments => UnmodifiableListView(_attachments);

  bool _visible = false;
  bool get visible => _visible;
  set visible (bool value) {
    _visible = value;
    notifyListeners();
  }

  PostColumn _selectedPostColumn = PostColumn.values.first;
  PostColumn get selectedPostColumn => _selectedPostColumn;
  set selectedPostColumn (PostColumn value) {
    _selectedPostColumn = value;
    notifyListeners();
  }

  Future<Post?> fetchFromServer(String id) async {
    // TODO: 顯示錯誤原因
    _id = id;
    _post = await PostRepo.getPost(_id);
    _visible = _post!.visible;

    // 附件傳輸
    final attachmentIds = json.decode(_post!.attachments) as List;
    final attachmentSet = <String, AttachmentInfo>{};
    await Future.wait(
      attachmentIds.map(
        (e) => PostRepo.getAttachmentInfo(e)
            .then((value) => attachmentSet[e.toString()] = value!),
      ),
    );
    _attachments = [];
    for (var str in attachmentIds) {
      _attachments.add(attachmentSet[str]!);
    }

    notifyListeners();
    return _post;
  }

  Future<void> uploadPost({
    required String title,
    required String content,
  }) async {
    if (_post == null) return;
    _post!
      ..title = title
      ..content = content
      ..column = _selectedPostColumn
      ..attachments = json.encode(_attachments.map((e) => e.id).toList())
      ..visible = _visible;
    await PostRepo.updatePost(_post!);
  }

  Future<String> uploadImage(Uint8List file, String filename) async {
    // TODO: 顯示錯誤原因
    final response = await PostRepo.uploadAttachment(file, filename);

    // TODO: 用正常的方式回傳圖片 uri
    var url = response!.blobUrl;
    url = url.replaceFirst("get_attachment", "attachment");
    url = url.replaceFirst("http", "https");
    return url;
  }

  Future<void> uploadAttachment(Uint8List file, String filename) async {
    // TODO: 顯示錯誤原因
    final response = await PostRepo.uploadAttachment(file, filename);
    _attachments.add((await PostRepo.getAttachmentInfo(response!.id))!);
    notifyListeners();
  }

  void removeAttachment(String id) {
    _attachments.removeWhere((e) => e.id == id);
    notifyListeners();
  }

  Future<void> delete() async {
    await PostRepo.delete(_id);
  }
}