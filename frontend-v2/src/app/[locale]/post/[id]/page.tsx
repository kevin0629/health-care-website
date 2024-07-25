import AttachmentPreview from "@/components/attachment-preview";
import QuillViewer from "@/components/quill-viewer";
import AttachmentUsecase from "@/module/attachment/application/attachmentUsecase";
import AttachmentEntity from "@/module/attachment/domain/attachmentEntity";
import AttachmentRepoImpl from "@/module/attachment/presenter/attachmentRepoImpl";
import NormalPostUsecase from "@/module/post/application/normalPostUsecase";
import PostRepoImpl from "@/module/post/presenter/postRepoImpl";
import PostViewModel from "@/module/post/presenter/postViewModel";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
    locale: string;
  };
}

export default async function PostPage({ params }: Props) {
  const postUsecase = new NormalPostUsecase(new PostRepoImpl());
  const attachmentUsecase = new AttachmentUsecase(new AttachmentRepoImpl());

  const idNum = Number.parseInt(params.id);
  if (idNum === Number.NaN) {
    notFound();
  }

  const entity = await postUsecase.getPostById(idNum);
  const viewModel = new PostViewModel(entity);

  const attachments: AttachmentEntity[] = [];
  for (var attachmentId of viewModel?.attachments ?? []) {
    const attachment = await attachmentUsecase.getAttachmentInfo(attachmentId);
    attachments.push(attachment);
  }

  const isEn = params.locale === "en";

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1>{isEn ? viewModel.titleEn : viewModel.title}</h1>
        <div className="flex flex-col text-sm">
          <span className="inline-flex items-center">
            <FontAwesomeIcon icon={faEye} className="size-4 me-2" />
            <span>{viewModel.view}</span>
          </span>
          <span className="inline-flex items-center">
            <FontAwesomeIcon icon={faClock} className="size-4 me-2" />
            <span>{viewModel.releasedDate}</span>
          </span>
        </div>
      </div>
      <hr className="my-3" />
      <QuillViewer value={isEn ? viewModel.contentEn : viewModel.content} />
      {
        attachments.length > 0 &&
        <AttachmentPreview className="mt-12" attachments={attachments} />
      }
    </div>
  );
}