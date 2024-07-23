"use client";

import "./editor.css";

import ReactQuill, { Quill } from "react-quill";
import { DeltaStatic, Sources } from "quill";
import React, { useMemo, useRef, useState } from "react";
import { ImageResize } from "quill-image-resize-module-ts";
import AttachmentRepoImpl from "@/module/attachment/presenter/attachmentRepoImpl";
import AttachmentUsecase from "@/module/attachment/application/attachmentUsecase";
import AttachmentViewModel from "@/module/attachment/presenter/attachmentViewModel";

Quill.register("modules/imageResize", ImageResize);

type Props = {
  className?: string;
  label?: string;
  value?: ReactQuill.Value;
  onChange?(value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor): void;
};

export default function Editor({
  className,
  label,
  value,
  onChange,
}: Props) {
  const quillRef = useRef<ReactQuill>(new ReactQuill({}));

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: async function () {
          const fileInput = document.createElement("input")
          fileInput.setAttribute("type", "file");
          fileInput.setAttribute("accept", "image/*");
          fileInput.click();

          fileInput.onchange = () => {
            const file = fileInput.files?.item(0);
            if (!file) return;

            const repo = new AttachmentRepoImpl();
            const usecase = new AttachmentUsecase(repo);

            usecase.uploadFile(file).then((attachment) => {
              const vm = new AttachmentViewModel(attachment);
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
              editor.insertEmbed(range?.index ?? 0, "image", vm.url);
            });
          };
        }
      },
    },
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  }), []);

  return (
    <div className={`${className} w-full`}>
      {label && <label htmlFor={label} className="label">{label}</label>}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        className={`w-full text-lg rounded-lg outline-none transition-all duration-200
            ${isFocus ? "ring-opacity-30 ring-yellow-900 ring-2" : "ring-gray-200 ring-1"}`}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  );
}
