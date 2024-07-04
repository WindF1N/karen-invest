import styles from './styles/FormLIGHT.module.css';
import { Field, useFormikContext } from 'formik';
import { useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

function FormLIGHT({ title, inputs, setInputs, errors, touched }) {

  const { setFieldValue } = useFormikContext();

  const handleFocus = (id) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        [id]: {
          ...prevState[id],
          isFocused: true
        },
      };
    });
  };

  const handleBlur = (id, value) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        [id]: {
          ...prevState[id],
          isFocused: value ? true : false
        },
      };
    });
  };

  const changeMask = (event, key) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        [key]: {
          ...prevState[key],
          selectChoice: event.target.value,
          mask: createNumberMask({
            prefix: '',
            suffix: ' ' + event.target.value,
            includeThousandsSeparator: true,
            thousandsSeparatorSymbol: '',
            allowDecimal: false,
            decimalSymbol: null,
            decimalLimit: 0, // количество знаков после запятой
            integerLimit: 4, // максимальное количество цифр до запятой
            allowNegative: false,
            allowLeadingZeroes: false,
          }),
        },
      };
    });
  }

  return (
    <div>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.inputs}>
        {inputs.map(([key, value]) => (
          <>
            {value.type === "text" &&
            <div className={styles.input} onClick={value.handleClick}>
              <Field name={key}>
                {({ field }) => (
                  <>
                    <label htmlFor={key} className={value.isFocused ? styles.focused : null}>{value.label}</label>
                    {value.mask ?
                      <MaskedInput {...field} type="text"
                                              inputMode='decimal'
                                              mask={() => value.mask(field.value)}
                                              onFocus={() => !value.handleClick ? handleFocus(key) : null}
                                              onBlur={() => !value.handleClick ? handleBlur(key, field.value) : null}
                                              className={value.error || (errors[key] && touched[key]) ? styles.error : null}
                                              value={field.value}
                                              readOnly={value.handleClick ? true : false}
                      />
                      : <input {...field} type="text"
                                          onFocus={() => !value.handleClick ? handleFocus(key) : null}
                                          onBlur={() => !value.handleClick ? handleBlur(key, field.value) : null}
                                          className={value.error || (errors[key] && touched[key]) ? styles.error : null}
                                          value={field.value}
                                          readOnly={value.handleClick ? true : false}
                        />}
                    {value.handleClick &&
                    <img src={require("./images/arrow-right.svg").default} alt="" style={{marginRight: 15}} />}
                    {value.choices?.length > 0 &&
                    <>
                      <div className={styles.selectChoice} onClick={() => {
                        document.getElementById(`select${key}`).focus()
                      }}>
                        {value.selectChoice}
                        <img src={require("./images/arrow-right.svg").default} alt="" />
                      </div>
                      <select id={`select${key}`} onChange={(event) => changeMask(event, key)}>
                        {value.choices.map((val, index) => (
                          <option value={val} key={`select${key}${index}`}>{val}</option>
                        ))}
                      </select>
                    </>}
                  </>
                )}
              </Field>
              {value.error || (errors[key] && touched[key]) && (
                <div className={styles.errorLabel}>
                    {value.error || errors[key]}
                </div>
              )}
            </div>}
            {value.type === "select" &&
            <Field name={key}>
              {({ field }) => (
                <div className={`${styles.input} ${styles.select} ${value.error || (errors[key] && touched[key]) ? styles.error : null}`} onClick={() => {
                  document.getElementById(`select${key}`).focus()
                }}>
                  <label htmlFor={key}>{value.label}</label>
                  <div className={field.value === "Не выбрано" ? styles.valueGray : styles.value} style={{whiteSpace: "nowrap"}}>
                    {field.value}
                    <img src={require("./images/arrow-right.svg").default} alt="" />
                  </div>
                  <select {...field} id={`select${key}`}>
                    {value.choices?.map((val, index) => (
                      <option value={val} key={`select${key}${index}`}>{val}</option>
                    ))}
                  </select>
                  {value.error || (errors[key] && touched[key]) && (
                    <div className={styles.errorLabel}>
                        {value.error || errors[key]}
                    </div>
                  )}
                </div>)}
            </Field>}
            {value.type === "radio" &&
            <div className={`${styles.input} ${styles.radio} ${value.error || (errors[key] && touched[key]) ? styles.error : null}`} onClick={(e) => {
              e.stopPropagation();
              document.getElementById(key).click()
            }}>
              <Field name={key}>
                {({ field }) => (
                  <>
                    <label htmlFor={key}>{value.label}</label>
                    <input
                      {...field}
                      id={key}
                      type="checkbox"
                      value={field.value}
                    />
                  </>
                )}
              </Field>
            </div>}
            {value.type === "textarea" &&
            <div className={`${styles.input} ${styles.textarea} ${value.error || (errors[key] && touched[key]) ? styles.error : null}`}>
              <Field name={key}>
                {({ field }) => (
                  <>
                    <label htmlFor={key} className={value.isFocused ? styles.focused : null}>{value.label}</label>
                    <textarea
                      {...field}
                      id={key}
                      onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = (e.target.scrollHeight) + 'px';
                        handleFocus(key)
                      }}
                      onBlur={() => handleBlur(key, field.value)}
                      rows="1"
                      maxLength={10000}
                      onChange={ev=>{ 
                        ev.target.style.height = 'auto';
                        ev.target.style.height = (ev.target.scrollHeight) + 'px';
                        setFieldValue(key, ev.target.value)
                      }}
                      onLoad={ev=>{ 
                        ev.target.style.height = 'auto';
                        ev.target.style.height = (ev.target.scrollHeight) + 'px';
                      }}
                    >
                    </textarea>
                  </>
                )}
              </Field>
              {value.error || (errors[key] && touched[key]) && (
                <div className={styles.errorLabel}>
                    {value.error || errors[key]}
                </div>
              )}
            </div>}
          </>
        ))}
      </div>
    </div>
  );
}

export default FormLIGHT;
