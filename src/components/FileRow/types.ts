import { cancelUpload } from "../../actions/files";

export interface IDispatchProps {}

export interface IStateProps {
  file?: any;
  cancelUpload: typeof cancelUpload;
}

export interface IProps extends IDispatchProps, IStateProps {}
