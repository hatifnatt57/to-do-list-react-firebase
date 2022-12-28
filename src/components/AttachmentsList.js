import { deleteObject, ref } from 'firebase/storage';
import { storage } from '../firebase';
import { useTodosDispatch } from '../utils/TodosContext';
import AttachmentItem from './AttachmentItem';

/**
 * Attachments' list component.
 */
export default function AttachmentsList({ id, attachments, editable }) {
  const dispatch = useTodosDispatch();

   /**
   * Delete attachment button click handler to be passed as a prop.
   * 
   * Delete attachment's file from storage bucket.
   * Dispatch update.
   * 
   * @param {number} attachmentId Attachment item index in attachments array.
   */
   function handleDeleteAttachment(attachmentId) {
    const fileRef = ref(storage, `${id}/${attachments[attachmentId]}`);
    deleteObject(fileRef);
    dispatch({
      type: 'updated',
      id,
      changedFields: {
        attachments: attachments.filter((att, i) => i !== attachmentId)
      }
    })
  }


  const attachmentComponents = attachments.map((attachment, i) => (
    <AttachmentItem 
      todoId={id}
      attachment={attachment} 
      editable={editable} 
      key={i}
      attachmentId={i}
      handleDeleteAttachment={handleDeleteAttachment}
    />
  ));

  return (
    <div className="attachments-list">
      <p className="attachments-list--title">Прикрепленные файлы:</p>
      <ul className="attachments-list--list">{attachmentComponents}</ul>
    </div>
  );
}