import React from "react"
import "./index.css"

import iframeSrc from "./iframe/index.html"

export default function App() {
  return <div className="page">
    <div className="left">left</div>
    <div className="right">
      <div className="right-top">right-top</div>
      <div className="right-content">right-content
        <div>
          <iframe
            id="inlineFrameExample"
            title="Inline Frame Example"
            width="800"
            height="500"
            src="/index.html">
          </iframe>
        </div>
      </div>
      <div className="right-bottom">right-bottom</div>
    </div>
  </div>;
}

