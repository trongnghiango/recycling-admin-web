import React from "react";
import Link from "next/link";
import { UiFileInputButton } from "../../ui/ui-file-input-button/UiFileInputButton";
import { uploadFileRequest } from "../../../domains/upload/upload.services";
import { useStateValue } from "state/AppProvider";
import { TOGGLE_MANDIBULAR, TOGGLE_MAXILLARY } from "state/ActionTypes";
import { StateActions } from "state/interfaces";
import { UserPage } from "../user-page/UserPage";

const s = {
  wrapper: ` flex flex-col container mx-auto`,
  title: `text-4xl font-bold text-center py-4 mb-4`,
};

interface IProps {
  testId?: string;
  data: any;
}

const IndexPage: React.FC<IProps> = (props) => {
  const { data, testId = IndexPage.displayName } = props;

  // console.log(props.data)

  const { state, dispatch } = useStateValue();

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>
        Wellcome to VKL Nha Khoa{" "}
        <span role="img" aria-label="hand waving">
          👋
        </span>
      </h1>
      {/* Trang user page */}
      <UserPage users={data} />
    </div>
  );
};

IndexPage.displayName = "IndexPage";

export default IndexPage;
