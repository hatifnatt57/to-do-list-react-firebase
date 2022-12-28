import { getDownloadURL, ref } from "@firebase/storage";
import { storage } from "../firebase";

/**
 * Attachment item component.
 */
export default function AttachmentItem({ todoId, attachment, editable, attachmentId, handleDeleteAttachment }) {
  /**
   * Attachment item filename click handler to be passed as a prop.
   * 
   * Download attachment.
   * 
   * @param {number} attachmentId Attachment item index in attachments array.
   */
  async function handleDownload() {
    const fileRef = ref(storage, `${todoId}/${attachment}`);
    const url = await getDownloadURL(fileRef);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = attachment;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  return (
    <li className={`attachment-item${editable ? ' attachment-item__editable' : ''}`}>
      <button className="attachment-item--download-btn" onClick={handleDownload}>{attachment}</button>
      {editable && (
        <button className="attachment-item--delete-btn" onClick={() => {handleDeleteAttachment(attachmentId)}}>
          <svg viewBox="0 0 20 21">
            <path d="M13.7909 10.5L19.4767 4.8142C20.1744 4.11648 20.1744 2.98523 19.4767 2.28693L18.2131 1.0233C17.5153 0.325568 16.3841 0.325568 15.6858 1.0233L10 6.70909L4.3142 1.0233C3.61648 0.325568 2.48523 0.325568 1.78693 1.0233L0.523295 2.28693C-0.174432 2.98466 -0.174432 4.11591 0.523295 4.8142L6.20909 10.5L0.523295 16.1858C-0.174432 16.8835 -0.174432 18.0148 0.523295 18.7131L1.78693 19.9767C2.48466 20.6744 3.61648 20.6744 4.3142 19.9767L10 14.2909L15.6858 19.9767C16.3835 20.6744 17.5153 20.6744 18.2131 19.9767L19.4767 18.7131C20.1744 18.0153 20.1744 16.8841 19.4767 16.1858L13.7909 10.5Z"/>
          </svg>
        </button>
      )}
    </li>
  );
}