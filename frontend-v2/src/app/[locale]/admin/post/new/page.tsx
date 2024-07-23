"use client";

import AttachmentPreview from "@/components/attachment-preview";
import Button from "@/components/button";
import DropdownButton from "@/components/dropdown-button";
import Editor from "@/components/editor";
import TextField from "@/components/text-field";
import AttachmentUsecase from "@/module/attachment/application/attachmentUsecase";
import AttachmentEntity from "@/module/attachment/domain/attachmentEntity";
import UploadingAttachmentEntity from "@/module/attachment/domain/uploadingAttachmentEntity";
import UploadingPregressMap from "@/module/attachment/domain/uploadingProgressMap";
import AttachmentRepoImpl from "@/module/attachment/presenter/attachmentRepoImpl";
import AttachmentUploadAction from "@/module/attachment/presenter/attachmentUploadAction";
import NormalPostUsecase from "@/module/post/application/normalPostUsecase";
import { PostRequest } from "@/module/post/application/postDto";
import PostColumnEnum from "@/module/post/domain/postColumnEnum";
import PostRepoImpl from "@/module/post/presenter/postRepoImpl";
import ImportanceEnum from "@/module/status/doamin/importanceEnum";
import ReleaseStatusEnum from "@/module/status/doamin/releaseStatusEnum";
import LengthValidationUsecase from "@/module/validation/application/lengthValidationUsecase";
import NotEmptyValidationUsecase from "@/module/validation/application/notEmptyValidationUsecase";
import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";

export default function NewPostPage() {
  const trans = useTranslations("Post");
  const statusTrans = useTranslations("Status");
  const attachmentTrans = useTranslations("Attachment");

  const [column, setColumn] = useState<PostColumnEnum>(PostColumnEnum.Latest);
  const [releaseStatus, setReleaseStatus] = useState<ReleaseStatusEnum>(ReleaseStatusEnum.Draft);
  const [importance, setImportance] = useState<ImportanceEnum>(ImportanceEnum.Normal);
  const [chineseTitle, setChineseTitle] = useState<string>("");
  const [englishTitle, setEnglishTitle] = useState<string>("");
  const [chineseContent, setChineseContent] = useState<ReactQuill.Value>("");
  const [englishContent, setEnglishContent] = useState<ReactQuill.Value>("");
  const [attachments, setAttachments] = useState<AttachmentEntity[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState<UploadingAttachmentEntity[]>([]);
  const [uploadingProgressMap, setUploadingProgressMap] = useState<UploadingPregressMap>({});
  const [toValidate, setToValidate] = useState<boolean>(false);
  const [isValidationPassed, setIsValidationPassed] = useState<boolean[]>([]);

  const postRepo = new PostRepoImpl();
  const postUsecase = new NormalPostUsecase(postRepo);
  const attachmentRepo = new AttachmentRepoImpl();
  const attachmentUsecase = new AttachmentUsecase(attachmentRepo);
  const attachmentUploadAction = new AttachmentUploadAction({
    usecase: attachmentUsecase,
    setAttachments: setAttachments,
    setUploadingAttachments: setUploadingAttachments,
    setUploadingProgressMap: setUploadingProgressMap,
  })

  const titleValidations = [
    new NotEmptyValidationUsecase(trans("validate_empty")),
    new LengthValidationUsecase(40, trans("validate_length", { length: 40 })),
  ]

  function handleValidate(result: boolean) {
    setToValidate(false);
    setIsValidationPassed((prev) => [...prev, result]);
  }

  function handleSave() {
    setIsValidationPassed([]);
    setToValidate(true);
  }

  useEffect(() => {
    if (isValidationPassed.length < 2 ||
      isValidationPassed.filter((value) => !value).length > 0) return;
    postUsecase.createPost(new PostRequest({
      title: chineseTitle,
      titleEn: englishTitle,
      content: chineseContent.toString(),
      contentEn: englishContent.toString(),
      attachments: attachments.map((attachment) => attachment.id),
      column: column,
      visibility: releaseStatus === ReleaseStatusEnum.Released,
      importance: importance === ImportanceEnum.Important,
    }));
  }, [isValidationPassed]);

  return (
    <div>
      <h1>{trans("new")}</h1>
      <form className="mt-6 flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <DropdownButton
            label={trans("column")}
            options={columnOptions.map((option) => trans(option))}
            className="h-10"
            onChange={(index) => setColumn(columnOptions[index])}
          />
          <DropdownButton
            label={statusTrans("status")}
            options={releaseStatusOptions.map((option) => statusTrans(option))}
            className="h-10"
            onChange={(index) => setReleaseStatus(releaseStatusOptions[index])}
          />
          <DropdownButton
            label={statusTrans("importance")}
            options={importanceOptions.map((option) => statusTrans(option))}
            className="h-10"
            onChange={(index) => setImportance(importanceOptions[index])}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            label={trans("chinese_title")}
            value={chineseTitle}
            onChange={setChineseTitle}
            onValidate={handleValidate}
            validations={titleValidations}
            toValidate={toValidate}
          />
          <TextField
            label={trans("english_title")}
            value={englishTitle}
            onChange={setEnglishTitle}
            onValidate={handleValidate}
            validations={titleValidations}
            toValidate={toValidate}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Editor label={trans("chinese_content")} value={chineseContent} onChange={setChineseContent} />
          <Editor label={trans("english_content")} value={englishContent} onChange={setEnglishContent} />
        </div>
        <div>
          <AttachmentPreview
            label={attachmentTrans("preview")}
            attachments={attachments}
            uploadingAttachments={uploadingAttachments}
            uploadingProgressMap={uploadingProgressMap}
            onChange={setAttachments}
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button className="border" onClick={() => { document.getElementById("upload")?.click() }}>
            <FontAwesomeIcon icon={faUpload} className="me-2 size-4" />
            <input id="upload" type="file" className="hidden" multiple={true}
              onChange={(event) => attachmentUploadAction.invoke(event.target.files)} />
            <span className="py-1">{attachmentTrans("upload")}</span>
          </Button>
          <Button className="border" onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} className="me-2 size-4" />
            <span className="py-1">{trans("save")}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

const columnOptions = [
  PostColumnEnum.Latest,
  PostColumnEnum.Activity,
  PostColumnEnum.Health,
  PostColumnEnum.Nutrition,
];

const releaseStatusOptions = [
  ReleaseStatusEnum.Draft,
  ReleaseStatusEnum.Released,
];

const importanceOptions = [
  ImportanceEnum.Normal,
  ImportanceEnum.Important,
];
