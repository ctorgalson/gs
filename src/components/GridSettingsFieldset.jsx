export default function GridSettingsFieldset({ children, legend, fieldsetName }) {
  return (
    <fieldset className={`gs__fieldset gs__fieldset--${fieldsetName}`}>
      <legend>{legend}</legend>
      <div className="gs__fieldset-inner">
        {children}
      </div>
    </fieldset>
  );
}
