import { TimesIcon } from "./icons/TimesIcon";

export function Modal({ src, alt, caption, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center m-0 bg-black top-0 max-w-full left-0 w-full bg-opacity-50">
      <div className="relative max-w-7xl rounded-lg shadow-2xl animate-in fade-in zoom-in">
      <span className="modal-close absolute shadow-sm rounded-sm bg-white p-2 z-10 -top-5 -right-2 cursor-pointer" onClick={onClose}>
          <TimesIcon />
        </span>
        <img className="modal-content rounded-md m-0 object-contain max-h-[800px] h-full my-auto w-full mx-auto" src={src} alt={alt} /></div>
    </div>
  );
}
