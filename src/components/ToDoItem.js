import { useRef, useState, useEffect } from 'react';
import { storage } from '../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import dayjs from 'dayjs';

import AttachmentsList from './AttachmentsList';
import Deadline from './Deadline';

/**
 * To-do item component.
 */
export default function ToDoItem({ todo, todoId, handleDone, deleteById, handleUpdate }) {
  const thisEl = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [editable, setEditable] = useState(false);

  /**
   * Count component's content height based on sum of children's height.
   * 
   * @returns {number} Component's content height in px.
   */
  function thisElHeight() {
    return [...thisEl.current.children].reduce((total, current) => total + current.offsetHeight, 0) + 2;
  }

  /**
   * When expanded state changes - trim textarea whitespace and expand/contract component's UI.
   */
  useEffect(() => {
    const textarea = thisEl.current.querySelector('.to-do-item--description');
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;

    thisEl.current.style.height = `${expanded ? thisElHeight() : 39}px`;
  }, [expanded]);

  /**
   * Expand/contract button click handler.
   * 
   * Toggle expanded state.
   */
  function handleExpand() {
    setExpanded(!expanded);
  }

  /**
   * Delete item button click handler.
   * 
   * Perform delete-item animation, delete item and its associated backend
   */
  function handleDelete() {
    thisEl.current.classList.add('to-do-item__deleted');
    setTimeout(() => {
      thisEl.current.style.display = 'none';
      deleteById(todoId);
    }, 300);
  }


  /**
   * Edit button click handler.
   * 
   * Toggle editable state.
   */
  function handleEdit() {
    setEditable(true);
  }

  /**
   * Accept button click handler.
   * 
   * Update app state with input values, set editable state to false.
   */
  function handleAccept() {
    const 
      title = thisEl.current.querySelector('.to-do-item--title').value || todo.title,
      description = thisEl.current.querySelector('.to-do-item--description').value,
      deadline = thisEl.current.querySelector('.deadline--input').value;

    thisEl.current.querySelector('.to-do-item--title').value = title;
    
    const changedItem = { title, description, deadline };
    handleUpdate(todoId, changedItem);
    setEditable(false);
  }

  /**
   * Textarea change handler.
   * 
   * Trim textarea whitespace, update component's height if needed.
   * 
   * @param {Event} e Change event.
   */
  function handleTextareaChange(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${e.target.scrollHeight}px`;
    thisEl.current.style.height = `${thisElHeight()}px`;
  }

  /**
   * File input change handler.
   * 
   * Upload files to storage bucket in todo item's folder.
   * Update app state.
   * Update component's height.
   * 
   * @param {Event} e Change event.
   */
  function handleFileInputChange(e) {
    const files = [...e.target.files];
    const filenames = todo.attachments;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      filenames.push(file.name);
      const fileRef = ref(storage, `${todo.id}/${file.name}`);
      uploadBytes(fileRef, file);
    };
    handleUpdate(todoId, { attachments: filenames });
    setTimeout(() => {
      thisEl.current.style.height = `${thisElHeight()}px`;
    }, 0);
  }

  /**
   * Delete attachment button click handler to be passed as a prop.
   * 
   * Delete attachment's file from storage bucket.
   * Update app state.
   * Update component's height.
   * 
   * @param {number} attachmentId Attachment item index in attachments array.
   */
  function handleDeleteAttachment(attachmentId) {
    const filenames = todo.attachments;
    const fileRef = ref(storage, `${todo.id}/${filenames[attachmentId]}`);
    deleteObject(fileRef);
    filenames.splice(attachmentId, 1);
    handleUpdate(todoId, { attachments: filenames });
    setTimeout(() => {
      thisEl.current.style.height = `${thisElHeight()}px`;
    }, 0);
  }

  /**
   * Attachment item filename click handler to be passed as a prop.
   * 
   * Download attachment.
   * 
   * @param {number} attachmentId Attachment item index in attachments array.
   */
  async function handleDownload(attachmentId) {
    const filename = todo.attachments[attachmentId];
    const fileRef = ref(storage, `${todo.id}/${filename}`);
    const url = await getDownloadURL(fileRef);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  /**
   * Compare today's date and deadline, return associated class name.
   * 
   * @returns {string} Expired/expires-today class name or nothing.
   */
  function getExpiredClass() {
    if (dayjs().isSame(dayjs(todo.deadline), 'day'))
      return 'to-do-item__expires-today';
    else if (dayjs().isAfter(dayjs(todo.deadline), 'day'))
      return 'to-do-item__expired';
    return '';
  }

  return (
    <li 
      className={`
        to-do-item:
        ${todo.done ? 'to-do-item__done:' : ''}
        ${expanded ? 'to-do-item__expanded:' : ''}
        ${editable ? 'to-do-item__editable:' : ''}
        ${getExpiredClass()}
      `
      .replaceAll('\n', '')
      .replaceAll(' ', '')
      .replaceAll(':', ' ')
      .trim()
      } 
      ref={thisEl}
    >
      <div className="to-do-item--main-container">
        <div className="to-do-item--first-line">
          <div className="to-do-item--done-btn-container">
            <button className="to-do-item--done-btn" onClick={() => {handleDone(todoId)}}></button>
          </div>
          <input type="text" className="to-do-item--title" defaultValue={todo.title} />
          <button className="to-do-item--expand-btn" onClick={handleExpand}>
            <svg viewBox="0 0 34 21">
              <path d="M18.4547 19.9695L33.1215 5.30264C33.8289 4.59527 33.8289 3.44845 33.1215 2.74116L31.4109 1.03051C30.7047 0.324348 29.5602 0.322989 28.8524 1.02749L17.1739 12.6513L5.49552 1.02749C4.7877 0.322989 3.64321 0.324348 2.93705 1.03051L1.2264 2.74116C0.519036 3.44853 0.519036 4.59535 1.2264 5.30264L15.8931 19.9695C16.6005 20.6768 17.7473 20.6768 18.4547 19.9695V19.9695Z"/>
            </svg>
          </button>
          <button className="to-do-item--delete-btn" onClick={handleDelete}>
            <svg viewBox="0 0 20 21">
              <path d="M13.7909 10.5L19.4767 4.8142C20.1744 4.11648 20.1744 2.98523 19.4767 2.28693L18.2131 1.0233C17.5153 0.325568 16.3841 0.325568 15.6858 1.0233L10 6.70909L4.3142 1.0233C3.61648 0.325568 2.48523 0.325568 1.78693 1.0233L0.523295 2.28693C-0.174432 2.98466 -0.174432 4.11591 0.523295 4.8142L6.20909 10.5L0.523295 16.1858C-0.174432 16.8835 -0.174432 18.0148 0.523295 18.7131L1.78693 19.9767C2.48466 20.6744 3.61648 20.6744 4.3142 19.9767L10 14.2909L15.6858 19.9767C16.3835 20.6744 17.5153 20.6744 18.2131 19.9767L19.4767 18.7131C20.1744 18.0153 20.1744 16.8841 19.4767 16.1858L13.7909 10.5Z"/>
            </svg>
          </button>
        </div>
        <textarea className="to-do-item--description" defaultValue={todo.description} onChange={handleTextareaChange} />
        <div className="to-do-item--bottom-line">
          <Deadline initialDate={todo.deadline} />
          {editable && (
            <button className="to-do-item--attach-btn" onClick={() => {
              thisEl.current.querySelector('.to-do-item--attach-btn input').click();
            }}>
              <svg viewBox="0 0 27 31">
                <path d="M2.54552 27.8693C-0.893769 24.3206 -0.829668 18.598 2.6271 15.0621L14.9739 2.43272C17.5824 -0.235595 21.8225 -0.23583 24.4313 2.43272C27.0147 5.07526 27.0178 9.3389 24.4313 11.9846L13.6685 22.983C11.9112 24.7804 9.04002 24.7554 7.31249 22.9242C5.64818 21.1602 5.70156 18.364 7.39796 16.6288L15.8589 7.98585C16.2228 7.6142 16.8191 7.60784 17.1907 7.97167L18.5364 9.28893C18.9081 9.65281 18.9144 10.2491 18.5505 10.6207L10.0905 19.2629C9.80016 19.5598 9.78227 20.0533 10.0523 20.3396C10.3097 20.6123 10.7142 20.6169 10.9757 20.3493L21.7385 9.35091C22.893 8.17003 22.893 6.24743 21.7379 5.0659C20.6084 3.91062 18.7973 3.91003 17.6674 5.0659L5.32049 17.6953C3.27429 19.7884 3.24274 23.1765 5.25039 25.248C7.25228 27.3136 10.4882 27.3162 12.4938 25.2648L22.6215 14.9052C22.9851 14.5333 23.5814 14.5266 23.9533 14.8901L25.2999 16.2065C25.6719 16.5701 25.6786 17.1664 25.315 17.5383L15.1872 27.8979C11.6805 31.4848 6.00817 31.4423 2.54552 27.8693V27.8693Z"/>
              </svg>
              <input type="file" multiple onChange={handleFileInputChange} />
            </button>
          )}
          <button className="to-do-item--edit-btn" onClick={handleEdit}>
            <svg viewBox="0 0 27 27">
              <path d="M15.1344 5.23489L21.6352 11.7357L7.5189 25.852L1.72288 26.4919C0.94696 26.5777 0.291391 25.9216 0.377717 25.1457L1.02262 19.3456L15.1344 5.23489ZM25.656 4.26702L22.6036 1.21464C21.6515 0.262518 20.1072 0.262518 19.1551 1.21464L16.2835 4.08625L22.7844 10.5871L25.656 7.71549C26.6081 6.76286 26.6081 5.21915 25.656 4.26702V4.26702Z"/>
            </svg>
          </button>
          <button className="to-do-item--accept-btn" onClick={handleAccept}>
            <svg viewBox="0 0 36 27">
              <path d="M12.2984 26.0803L0.884355 14.6663C0.198623 13.9806 0.198623 12.8688 0.884355 12.183L3.36766 9.69958C4.05339 9.01378 5.1653 9.01378 5.85103 9.69958L13.5401 17.3885L30.0091 0.919573C30.6948 0.23384 31.8067 0.23384 32.4925 0.919573L34.9758 3.40294C35.6615 4.08868 35.6615 5.20051 34.9758 5.88631L14.7817 26.0804C14.0959 26.7661 12.9841 26.7661 12.2984 26.0803V26.0803Z"/>
            </svg>
          </button>
        </div>
      </div>
      {todo.attachments.length > 0 &&
        <AttachmentsList 
          attachments={todo.attachments} 
          editable={editable} 
          handleDeleteAttachment={handleDeleteAttachment}
          handleDownload={handleDownload}
        />
      }
    </li>
  )
}