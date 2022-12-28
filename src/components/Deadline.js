import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import dayjs from 'dayjs';

/**
 * Date picker/indicator component.
 */
const Deadline = forwardRef(function Deadline({ initialDate, done, editable }, ref) {
  const inputRef = useRef(null);
  const [date, setDate] = useState(initialDate);

  useImperativeHandle(ref, () => {
    return {
      value: inputRef.current.value
    }
  })

  let modifier = '';
  if (editable)
    modifier = ' deadline__editable';
  else {
    if (done)
      modifier = 'done';
    else if (dayjs().isSame(dayjs(date), 'day'))
      modifier = 'expires-today';
    else if (dayjs().isAfter(dayjs(date), 'day'))
      modifier = 'expired';
    if (modifier !== '')
      modifier = ` deadline__${modifier}`;
  }

  const deadlineClassName = 'deadline' + modifier;

  /**
   * Open native date picker.
   */
  function clickHandler() {
    inputRef.current.showPicker();
  }

  /**
   * Set date state if new date is valid.
   * 
   * @param {Event} e Change event.
   */
  function changeHandler(e) {
    if (dayjs(e.target.value).isValid()) 
      setDate(e.target.value);
  }

  return (
    <button className={deadlineClassName} onClick={clickHandler}>
      <input className="deadline--input" type="date" value={date} onChange={changeHandler} ref={inputRef} />
      {dayjs(date).format('DD.MM.YYYY')}
    </button>
  )
})

export default Deadline;