import React, { ElementType, FunctionComponent, useState } from "react";
import { IProps } from "./types";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./FileRow.module.css";
import ErroIcon from "@material-ui/icons/Error";

const FileRow: FunctionComponent<IProps> = ({ file }: IProps) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const formatBytes = (x: string) => {
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  };

  const renderLabel = (file: any) => {
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

  const getStatus = (file: any) => {
    if (file.error) {
      return `error: ${file.error.message}`;
    }
    if (file.progress === 100) {
      return "done";
    }
    if (file.progress > 0) {
      return `uploading ${file.progress}%`;
    }
    if (file.progress === 0) {
      return "processing...";
    }
  };

  const renderIcon = (file: any) => {
    if (file.error) {
      return <ErroIcon />;
    }
    if (file.progress < 100) {
      return (
        <CircularProgress
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

  const getStatusColor = (file: any) => {
    if (file.progress === 100) {
      return "primary";
    }
    if (file.error) {
      return "secondary";
    }
  };

  return (
    <div>
      <Chip
        icon={renderIcon(file)}
        color={getStatusColor(file)}
        classes={{ root: styles.chip }}
        label={renderLabel(file)}
        onDelete={() => console.log("deleted")}
      />
    </div>
  );
};

export default FileRow;
