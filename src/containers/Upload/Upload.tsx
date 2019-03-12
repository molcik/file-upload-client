import { IAbort, IError, ILoad, IProgress } from "../../common/types";
import styles from "../Upload/Upload.module.css";
import { FilePond } from "react-filepond";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IState } from "../../services/storeFactory";
import { fileActions } from "../../actions";
import { IDispatchProps, IStateProps, IProps } from "./types";

const Upload = ({ files, fileActions }: IProps) => {
  const handleProcessing = (
    filename: string,
    file: File,
    metadata: any,
    error: IError,
    progress: IProgress,
    load: ILoad,
    abort: IAbort
  ) => {
    // handle file upload here
    progress(true, 0, 100);
    fileActions.uploadFile(filename, file, metadata);
  };

  return (
    <FilePond
      className={styles.drop}
      allowMultiple={true}
      server={
        {
          process: handleProcessing /* TODO: remove any whey types are fixed in dependency */
        } as any
      }
      onupdatefiles={fileItems => fileItems}
    />
  );
};

const mapStateToProps = (state: IState): IStateProps => ({
  files: state.files
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fileActions: bindActionCreators(fileActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upload);
