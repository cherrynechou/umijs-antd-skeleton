/**
 * 创建菜单通用
 */

export interface CreateOrEditProps {
  isModalVisible: boolean,
  isShowModal: (show: boolean, id?: number | undefined) => void,
  editId : number,
  actionRef: any
}