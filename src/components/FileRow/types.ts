import { fileActions } from "../../actions";
import { IFile } from "../../reducers/types";

export interface IProps {
  fileState: IFile;
  fileActions: typeof fileActions;
}
