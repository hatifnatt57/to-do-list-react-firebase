import { forwardRef, useImperativeHandle, useRef } from 'react';

const Description = forwardRef(function Description({ recalculateTodoHeight, initialValue, editable }, ref) {
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      value: textareaRef.current.value,
      setValue(newValue) {
        textareaRef.current.value = newValue;
      },
      recalculateTextareaHeight
    }
  })

  function recalculateTextareaHeight() {
    textareaRef.current.style.height = '1px';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }

  /**
   * Textarea change handler.
   * 
   * Trim textarea whitespace, update component's height if needed.
   */
  function handleChange() {
    recalculateTextareaHeight();
    recalculateTodoHeight();
  }

  return (
    <textarea
      spellCheck="false"
      className={editable ? 'description description__editable' : 'description'} 
      ref={textareaRef}
      defaultValue={initialValue} 
      onChange={handleChange}
    />
  )
});

export default Description;