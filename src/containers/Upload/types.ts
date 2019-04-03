import { fileActions } from "../../actions";
import { IFilesState } from "../../reducers/types";

export interface IDispatchProps {
  actions: typeof fileActions;
}

export interface IStateProps {
  files: IFilesState;
}

export interface IProps extends IDispatchProps, IStateProps {}
