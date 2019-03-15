import { cancelUpload } from "../../actions/files";

export interface IDispatchProps {}

export interface IStateProps {
  file?: any;
  fileActions: any;
}

export interface IProps extends IDispatchProps, IStateProps {}
