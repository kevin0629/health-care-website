"use client";

import NormalPostUsecase from "@/module/post/application/normalPostUsecase";
import PostRepoImpl from "@/module/post/presenter/postRepoImpl";
import PostViewModel from "@/module/post/presenter/postViewModel";
import { notFound, usePathname, useRouter } from "next/navigation";
import PostEditor from "../../post-editor";
import PostEntity from "@/module/post/domain/postEntity";
import PostColumnEnum from "@/module/post/domain/postColumnEnum";
import { useEffect, useState } from "react";

type Props = {
  params: { locale: string, id: string };
};

const usecase = new NormalPostUsecase(new PostRepoImpl());

export default function EditPostPage({ params }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [post, setPost] = useState<PostViewModel | undefined>(undefined);

  async function fetchAll() {
    const idNum = parseInt(params.id);
    const entity = await usecase.getPostById(idNum);
    setPost(new PostViewModel(entity));
  }

  useEffect(() => {
    fetchAll().catch((err) => {
      console.error(err);
      router.replace(`/${params.locale}/404?notfound=${pathname}`);
    });
  }, []);

  return post === undefined
    ? (<></>)
    : (
      <PostEditor
        updateId={post.id}
        defaultColumn={post.column}
        defaultReleaseStatus={post.releaseStatus}
        defaultImportance={post.importanceStatus}
        defaultTitle={post.title}
        defaultTitleEn={post.titleEn}
        defaultContent={post.content}
        defaultContentEn={post.contentEn}
        defaultAttachmentIds={post.attachments}
        backUrl="/admin/post"
        columnOptions={[
          PostColumnEnum.Latest,
          PostColumnEnum.Activity,
          PostColumnEnum.Health,
          PostColumnEnum.Nutrition,
        ]}
      />
    );
}
