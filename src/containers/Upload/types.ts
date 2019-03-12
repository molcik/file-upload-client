import { IFilesState } from "../../reducers/types";
import { fileActions } from "../../actions";

export interface IDispatchProps {
  fileActions: typeof fileActions;
}

export interface IStateProps {
  files?: IFilesState;
}

export interface IProps extends IDispatchProps, IStateProps {}
