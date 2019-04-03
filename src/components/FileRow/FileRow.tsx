import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";
import ErroIcon from "@material-ui/icons/Error";
import React, { FunctionComponent, MouseEvent } from "react";
import { IFile } from "../../reducers/types";
import styles from "./FileRow.module.css";
import { IProps } from "./types";

const FileRow: FunctionComponent<IProps> = ({
  fileState,
  fileActions
}: IProps) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const formatBytes = (x: number) => {
    let l = 0;
    let n = x || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  };

  const renderLabel = (file: IFile) => {
    return (
      <div className={styles.labelContainer}>
        <span className={styles.labelLeft}>
          <p className={styles.labelName}>{file.name}</p>
          <p className={styles.labelSize}>{formatBytes(file.size)}</p>
        </span>
        <span className={styles.labelRight}>
          <p className={styles.labelStatus}>{getStatus(file)}</p>
        </span>
      </div>
    );
  };

  const getStatus = (file: IFile) => {
    if (file.error) {
      return `${file.error}`;
    }
    if (file.progress === 100) {
      return "done";
    }
    if (file.progress > -1) {
      return `uploading ${file.progress}%`;
    }
    if (file.progress === -1) {
      return "processing...";
    }
  };

  const renderIcon = (file: IFile) => {
    if (file.error) {
      return <ErroIcon />;
    }
    if (file.progress < 100) {
      return (
        <CircularProgress
          color={"secondary"}
          classes={{ root: styles.spinner }}
          size={20}
          thickness={4}
        />
      );
    }
    if (file.progress === 100) {
      return <DoneIcon />;
    }
  };

  const getStatusColor = (file: IFile) => {
    if (file.progress === 100) {
      return "primary";
    }
    if (file.error) {
      return "secondary";
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (fileState.url) {
      window.open(fileState.url);
    }
    event.stopPropagation();
  };

  const handleDelete = () => {
    if (fileState.progress === 100 || fileState.error) {
      fileActions.removeFile(fileState);
    } else {
      fileActions.cancelUpload(fileState);
    }
  };

  return (
    <div>
      <Chip
        icon={renderIcon(fileState)}
        onClick={handleClick}
        color={getStatusColor(fileState)}
        classes={{ root: styles.chip }}
        className={fileState.error && styles.error}
        label={renderLabel(fileState)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FileRow;
