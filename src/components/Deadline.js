import { useRef, useState } from 'react';

import dayjs from 'dayjs';

/**
 * Date picker/indicator component.
 */
export default function Deadline({ initialDate }) {
  const thisInput = useRef(null);
  const [date, setDate] = useState(initialDate);

  /**
   * Open native date picker.
   */
  function clickHandler() {
    thisInput.current.showPicker();
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
    <button className="deadline" onClick={clickHandler}>
      <input className="deadline--input" type="date" value={date} onChange={changeHandler} ref={thisInput} />
      {dayjs(date).format('DD.MM.YYYY')}
    </button>
  )
}