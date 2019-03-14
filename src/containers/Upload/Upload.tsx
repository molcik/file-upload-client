import styles from "../Upload/Upload.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IState } from "../../services/storeFactory";
import { fileActions } from "../../actions";
import { IDispatchProps, IStateProps, IProps } from "./types";
import Dropzone from "react-dropzone";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FileRow from "../../components/FileRow";

const Upload = ({ files, fileActions }: IProps) => {
  const processFiles = (addedFiles: File[]): void => {
    addedFiles.map(file => fileActions.uploadFile(file));
  };

  return (
    <Dropzone onDrop={acceptedFiles => processFiles(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section {...getRootProps()} className={styles.drop}>
          <Card classes={{ root: styles.card }}>
            <CardContent>
              <input {...getInputProps()} />
              <p className={styles.text}>
                Drag 'n' drop files here, or click to select
              </p>
              {files &&
                files.files &&
                files.files.map((file, index) => (
                  <FileRow
                    file={file}
                    key={index}
                    cancelUpload={fileActions.cancelUpload}
                  />
                ))}
            </CardContent>
          </Card>
        </section>
      )}
    </Dropzone>
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
