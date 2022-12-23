import AttachmentItem from './AttachmentItem';

/**
 * Attachments' list component.
 */
export default function AttachmentsList({ attachments, editable, handleDeleteAttachment, handleDownload }) {
  const attachmentComponents = attachments.map((attachment, i) => (
    <AttachmentItem 
      attachment={attachment} 
      editable={editable} 
      key={i}
      attachmentId={i}
      handleDeleteAttachment={handleDeleteAttachment}
      handleDownload={handleDownload}
    />
  ));

  return (
    <div className="attachments-list">
      <p className="attachments-list--title">Прикрепленные файлы:</p>
      <ul className="attachments-list--list">{attachmentComponents}</ul>
    </div>
  );
}