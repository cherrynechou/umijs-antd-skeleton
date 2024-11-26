/**
 * 生成树型列表所需要的
 */
export interface ITreeOption {
  idKey: string | number,
  nameKey: string,
  parentIdKey: string,
  childrenKey: string,
  rootValue: string | number
}

export interface ITreeDataObj {
  [id: string]: any,
  children?: ITreeDataObj[],
  title: string,
  parent_id: string | number
}
