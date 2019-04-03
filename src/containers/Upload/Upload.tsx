import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { fileActions } from "../../actions";
import FileRow from "../../components/FileRow";
import { IFile } from "../../reducers/types";
import { IState } from "../../services/storeFactory";
import styles from "../Upload/Upload.module.css";
import { IDispatchProps, IProps, IStateProps } from "./types";

const Upload = ({ files, actions }: IProps) => {
  const processFiles = (addedFiles: File[]): void => {
    addedFiles.map(file => actions.uploadFile(file));
  };

  const renderFileRow = (rowFiles: IFile[]) => {
    return (
      rowFiles &&
      rowFiles.map((file, index) => (
        <FileRow fileState={file} key={index} fileActions={actions} />
      ))
    );
  };

  const renderDropArea = (getRootProps: any, getInputProps: any) => {
    return (
      <section {...getRootProps()} className={styles.drop}>
        <Card classes={{ root: styles.card }}>
          <CardContent>
            <input {...getInputProps()} />
            <p className={styles.text}>
              Drag 'n' drop files, or click to select.
            </p>
            {renderFileRow(files.files)}
          </CardContent>
        </Card>
      </section>
    );
  };

  return (
    <Dropzone onDrop={processFiles}>
      {({ getRootProps, getInputProps }) =>
        renderDropArea(getRootProps, getInputProps) // tslint:disable-line
      }
    </Dropzone>
  );
};

const mapStateToProps = (state: IState): IStateProps => ({
  files: state.files
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  actions: bindActionCreators(fileActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Upload);
