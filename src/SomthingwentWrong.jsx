import React from 'react'
import ReplayIcon from '@mui/icons-material/Replay';
const SomthingwentWrong = () => {
    const reloadPage = () => {
        window.location.reload();
      };
  return (
    <div className="h-full m-0 p-0 box-border text-[12px] font-avenir text-gray-900 ">
    <header className="relative grid items-center justify-center p-4 border-b border-gray-400">
      <svg
        version="1.1"
        alt="4C Logo"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 60.8"
        className="absolute top-1/2 left-0 h-10 transform -translate-y-1/2"
      >
        
      </svg>
      <span className="inline-flex items-center font-normal text-lg tracking-wide">
        Error Code: <code className="ml-1 px-2.5 py-1 rounded-2xl text-[#c30035] bg-[#ffebf1]">502</code>
      </span>
    </header>

    <article className="grid place-content-center place-items-center">
      <h1 className="font-roboto-slab text-4xl font-light">Something went wrong...</h1>
      <svg
        alt="Web browser with concerned expression"
        width="151px"
        height="140px"
        viewBox="0 0 151 140"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title>Just a moment...</title>
        <g id="Well shoot..." stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-31.000000, -40.000000)">
            <g transform="translate(31.000000, 40.000000)">
              <rect id="exclaim-1" fill="#584B86" x="22" y="0" width="2" height="14" rx="1" />
              <rect
                id="exclaim-2"
                fill="#584B86"
                transform="translate(7.000000, 23.000000) rotate(90.000000) translate(-7.000000, -23.000000)"
                x="6"
                y="16"
                width="2"
                height="14"
                rx="1"
              />
              <rect
                id="exclaim-3"
                fill="#584B86"
                transform="translate(12.000000, 12.000000) rotate(-45.000000) translate(-12.000000, -12.000000)"
                x="11"
                y="5"
                width="2"
                height="14"
                rx="1"
              />
              <ellipse id="shadow" fill="#000000" opacity="0.08" cx="79" cy="129.5" rx="72" ry="10.5" />
              <rect id="body" fill="#FFFFFF" x="22" y="22" width="114" height="106" rx="9" />
              <polygon
                id="toolbar"
                fill="#CDCADD"
                points="23 47 79 47 135 47 135 32 135 29 132 25 128 23 29.9948981 23 26 25 24 27 23 30"
              />
              <circle id="toolbar-button-1" stroke="#584B86" strokeWidth="2" fill="#FFFFFF" cx="33.5" cy="34.5" r="2.5" />
              <circle id="toolbar-button-2" stroke="#584B86" strokeWidth="2" fill="#FFFFFF" cx="43.5" cy="34.5" r="2.5" />
              <circle id="toolbar-button-3" stroke="#584B86" strokeWidth="2" fill="#FFFFFF" cx="53.5" cy="34.5" r="2.5" />
              <rect id="toolbar-border-bottom" fill="#584B86" x="22" y="45" width="114" height="2" />
              <rect id="toolbar-shadow" fill="#000000" opacity="0.08" x="24" y="47" width="110" height="2" />
              <rect id="window-border" stroke="#584B86" strokeWidth="2" x="23" y="23" width="112" height="104" rx="9" />
              <g id="eyes">
                <ellipse id="eye-left" fill="#584B86" cx="56.5" cy="72.5" rx="3.5" ry="3.5">
                  <animate
                    attributeName="ry"
                    repeatCount="indefinite"
                    fill="freeze"
                    values="3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;0.5;2"
                    from="3.5"
                    to="0.5"
                    dur="3s"
                    id="leftEyeAnim"
                    d="leftEyeAnim"
                  />
                </ellipse>
                <ellipse id="eye-right" fill="#584B86" cx="101.5" cy="72.5" rx="3.5" ry="3.5">
                  <animate
                    attributeName="ry"
                    repeatCount="indefinite"
                    fill="remove"
                    values="3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;3.5;0.5;2"
                    from="3.5"
                    to="0.5"
                    dur="3s"
                  />
                </ellipse>
                <animateMotion
                  dur="6s"
                  fill="freeze"
                  calcMode="linear"
                  repeatCount="indefinite"
                  keyPoints="0; 0;   0;   0;    0;    0;    0.25; 0.25; 0.25; 0.75; 0.75; 0.75;  0.75; 1; 1"
                  keyTimes=" 0; 0.1; 0.2; 0.3;  0.4;  0.5;  0.6;  0.65; 0.7;  0.75; 0.8;  0.825; 0.85; 0.9; 1"
                  path="M 0 0 C 5 2, 5 2, 12 0 C 0 3, 0 3, -10 0 H 0"
                />
                <rect id="mouth" fill="#584B86" x="65" y="94" width="28" height="2" rx="1" />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <p className="font-normal text-lg tracking-wide text-center">
        Our engineers are currently fixing something.
        <br />We expect them to be done soon.
        <br />
        <button onClick={reloadPage} className='text-3xl'>Reload Page <ReplayIcon /></button>;
      </p>
    </article>
  </div>
  )
}

export default SomthingwentWrong