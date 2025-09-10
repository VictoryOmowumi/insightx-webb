import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { EditIcon, LinkIcon } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";

const FormCards = ({ loading, forms }) => {


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-4 min-w-[350px] w-full h-[190px]  bg-gray-100/70 dark:bg-off-black-300 rounded-[20px]"
          >
            <Skeleton className="" />
            <Skeleton className="" />
            <Skeleton className="" />
          </div>
        ))
        : forms.map((form) => (
          <div
            key={form._id}
            className="flex flex-col justify-between  p-5 bg-[#faf7eda1] dark:bg-neutral-700 min-w-[350px] w-full h-[190px]  rounded-[20px]  cursor-pointer transition-all duration-300"
          >
            <div className="flex justify-between ">
              <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                {form.title}
                {form.visibility === "public" && (
                  <Link
                    to={`/forms/response/${form.slug}/${form._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 dark:text-gray-200 hover:scale-105 transition-transform duration-300"
                  >
                    <LinkIcon size={16} strokeWidth={1} />
                  </Link>
                )
                }
              </h1>
              <span
                className={`px-2 py-1 h-max rounded-full text-xs  capitalize ${form.status === "published"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                  }`}
              >
                {form.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-200 capitalize font-light">
              {moment(form.createdAt).fromNow()} on{" "}
              {moment(form.createdAt).format("MMM DD, YYYY")}
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {form.description}
              </p>

              {form.status === "published" ? (
                <Link
                  to={`/forms/form-builder/${form._id}`}

                  className="bg-[#ffffff] dark:bg-neutral-500 dark:text-gray-200 flex items-center justify-center gap-2 text-gray-500 p-2 rounded-md text-sm font-medium"
                >
                  View Form
                </Link>
              ) : (
                <Link
                  to={`/forms/form-builder/${form._id}`}
                  className="bg-[#ffffff] dark:bg-gray-900 dark:text-gray-200 flex items-center justify-center gap-2 text-gray-500  p-2 rounded-md text-sm font-medium"
                >
                  Edit Form 
                </Link>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default FormCards;
