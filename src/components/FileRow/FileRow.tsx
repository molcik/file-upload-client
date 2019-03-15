import React, { MouseEvent, FunctionComponent } from "react";
import { IProps } from "./types";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./FileRow.module.css";
import ErroIcon from "@material-ui/icons/Error";
import { IFile } from "../../reducers/types";

const FileRow: FunctionComponent<IProps> = ({ file, fileActions }: IProps) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const formatBytes = (x: number) => {
    let l = 0,
      n = x || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  };

  const renderLabel = (file: IFile) => {
    return (
      <div>
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
    file.url && window.open(file.url);
    event.stopPropagation();
  };

  const handleDelete = () => {
    if (file.progress === 100 || file.error) {
      fileActions.removeFile(file);
    } else {
      fileActions.cancelUpload(file);
    }
  };

  return (
    <div>
      <Chip
        icon={renderIcon(file)}
        onClick={handleClick}
        color={getStatusColor(file)}
        classes={{ root: styles.chip }}
        className={file.error && styles.error}
        label={renderLabel(file)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FileRow;
