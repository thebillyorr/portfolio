// content.js
export const CARD_CONTENT = {
  resume: {
    face: `
      <div class="resume-mini">
        <div class="resume-mini__title">Resume</div>
      </div>
    `,
    modal: `
      <div class="rp">
        <header class="rp-header">
          <h2 class="rp-title">Resume</h2>
        </header>

        <ul class="rp-section active" role="tabpanel" aria-labelledby="experience">
          <li class="rp-item">
            <div class="rp-logo-section">
              <svg class="rp-logo microsoft" xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-33.0981 -55.17375 286.8502 331.0425"><path d="M104.868 104.868H0V0h104.868z" fill="#f35325"/><path d="M220.654 104.868H115.787V0h104.867z" fill="#81bc06"/><path d="M104.865 220.695H0V115.828h104.865z" fill="#05a6f0"/><path d="M220.654 220.695H115.787V115.828h104.867z" fill="#ffba08"/></svg>
              <div class="rp-meta">📍 Redmond, USA</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Program Manager Intern @ <span class="company-name microsoft-name">Microsoft</span></div>
              <div class="rp-meta">May 2025 – Aug 2025</div>
            </div>
            <div class="rp-tagline" style="--rotation: 2deg; --max-width: 200px;">AI. ML. RAG. MCP. LLMs. Did it all. </div>
            <button class="rp-action-btn" style="--rotation: -3deg;" title="View details"><svg class="rp-action-btn__logo" xmlns="http://www.w3.org/2000/svg" viewBox="-47.36265 -79.99825 410.4763 479.9895"><path d="M294.93 130.971a79.712 79.712 0 00-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 00141.11.001c-35.04-.08-66.13 22.48-76.91 55.82a79.754 79.754 0 00-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 006.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0060.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0053.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11a59.77 59.77 0 01-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 005.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03a59.71 59.71 0 01-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49l-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 01-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 00-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 017.15 40.1zm-168.51 55.43l-26.94-15.55a.943.943 0 01-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8a10.344 10.344 0 00-5.24 9.06l-.04 89.79zm14.63-31.54l34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"/></svg></button>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <svg class="rp-logo sap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="800" width="1200" viewBox="-13.46715 -11.109375 116.7153 66.65625"><defs><linearGradient spreadMethod="pad" gradientTransform="rotate(-90 70.205 .3015) scale(37.1015)" gradientUnits="userSpaceOnUse" id="a" y2="0" x2=".9572" y1="0" x1="0"><stop offset="0" stop-color="#00b8f1"/><stop offset=".2199" stop-color="#06a5e5"/><stop offset=".2199" stop-color="#06a5e5"/><stop offset=".7943" stop-color="#1870c5"/><stop offset="1" stop-color="#1d61bc"/></linearGradient><linearGradient spreadMethod="pad" gradientTransform="matrix(0 46.3769 46.3769 0 44.859 .024)" gradientUnits="userSpaceOnUse" xlink:href="#a" id="b" y2="0" x2=".9572" y1="0" x1="0"/></defs><path d="M0 0v44.415h45.371L89.781.005H0z" fill="url(#b)"/><path d="M57.4688 39.875v3.3125h.5V41.75h.5624l.9063 1.4375H60l-.9688-1.4375c.4841-.06.875-.3415.875-.9375 0-.653-.3996-.9375-1.1874-.9375zm.5.4375h.6874c.3381 0 .7188.055.7188.4687 0 .5171-.3855.5626-.8125.5626h-.5937zm.625-1.6563c-1.586 0-2.9376 1.2221-2.9376 2.875 0 1.665 1.3515 2.9063 2.9376 2.9063 1.564 0 2.875-1.2411 2.875-2.9063 0-1.6529-1.311-2.875-2.875-2.875zm0 .4688c1.2939 0 2.3124 1.0453 2.3124 2.4062 0 1.3842-1.0185 2.4063-2.3124 2.4063-1.3161 0-2.375-1.0221-2.375-2.4063 0-1.3609 1.0589-2.4062 2.375-2.4062z" fill="#1870c5"/><path d="M53.797 21.252h-1.946v-7.117h1.946c2.598 0 4.666.856 4.666 3.513 0 2.744-2.068 3.604-4.666 3.604M32.852 26.34c-1.03 0-1.996-.188-2.831-.502l2.803-8.84h.06l2.745 8.864c-.827.296-1.768.478-2.774.478M53.281 8.353h-8.837v21.013l-7.72-21.013h-7.652l-6.596 17.568c-.697-4.428-5.284-5.961-8.89-7.104-2.377-.765-4.907-1.889-4.884-3.134.02-1.018 1.359-1.962 4-1.821 1.78.09 3.35.234 6.467 1.741l3.07-5.348C19.395 8.802 15.454 7.89 12.23 7.883h-.02c-3.761 0-6.895 1.226-8.839 3.233-1.351 1.404-2.082 3.18-2.115 5.157-.05 2.708.947 4.63 3.034 6.167 1.766 1.294 4.019 2.127 6.009 2.751 2.455.757 4.459 1.418 4.436 2.827-.02.513-.211.994-.582 1.374-.611.635-1.55.87-2.849.899-2.504.05-4.361-.34-7.319-2.088l-2.729 5.423c2.949 1.679 6.44 2.661 10.003 2.661h.461c3.1-.06 5.604-.945 7.605-2.553l.324-.283-.884 2.376h8.025l1.348-4.099c1.41.477 3.016.745 4.716.745 1.659 0 3.224-.25 4.609-.706l1.296 4.06h13.094v-8.49h2.857c6.9 0 10.986-3.512 10.986-9.406 0-6.56-3.968-9.569-12.416-9.569" fill="#fff" fill-rule="evenodd"/></svg>
              <div class="rp-meta">📍 Vancouver, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ <span class="company-name sap-name">SAP</span></div>
              <div class="rp-meta">Sep 2024 – Apr 2025</div>
            </div>
            <div class="rp-tagline" style="--rotation: -2.5deg; --max-width: 400px;">Physical Security. 100+ offices worldwide. Yes we were busy. </div>
            <button class="rp-action-btn" style="--rotation: 2.8deg;" title="View details"><svg class="rp-action-btn__logo" xmlns="http://www.w3.org/2000/svg" viewBox="-47.36265 -79.99825 410.4763 479.9895"><path d="M294.93 130.971a79.712 79.712 0 00-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 00141.11.001c-35.04-.08-66.13 22.48-76.91 55.82a79.754 79.754 0 00-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 006.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0060.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0053.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11a59.77 59.77 0 01-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 005.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03a59.71 59.71 0 01-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49l-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 01-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 00-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 017.15 40.1zm-168.51 55.43l-26.94-15.55a.943.943 0 01-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8a10.344 10.344 0 00-5.24 9.06l-.04 89.79zm14.63-31.54l34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"/></svg></button>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <svg class="rp-logo intact" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.4 48.5" style="enable-background:new 0 0 111.4 48.5;" xml:space="preserve">
                <style type="text/css">
                  .st0{fill:#C60C30;}
                  .st1{clip-path:url(#SVGID_2_);fill:#1E1E1E;}
                  .st2{clip-path:url(#SVGID_4_);fill:#1E1E1E;}
                  .st3{clip-path:url(#SVGID_6_);fill:#1E1E1E;}
                  .st4{clip-path:url(#SVGID_8_);fill:#1E1E1E;}
                  .st5{clip-path:url(#SVGID_10_);fill:#1E1E1E;}
                </style>
                <g>
                  <polygon class="st0" points="0,0 0,48.5 16.5,48.5 16.5,43.4 5.1,43.4 5.1,5.1 16.5,5.1 16.5,0 	"/>
                  <polygon class="st0" points="94.9,0 94.9,5.1 106.3,5.1 106.3,43.4 94.9,43.4 94.9,48.5 111.4,48.5 111.4,0 	"/>
                  <g>
                    <g>
                      <defs>
                        <rect id="SVGID_1_" width="111.4" height="48.5"/>
                      </defs>
                      <clipPath id="SVGID_2_">
                        <use href="#SVGID_1_" style="overflow:visible;"/>
                      </clipPath>
                      <path class="st1" d="M41.2,23.8c0-3-0.8-3.9-1.4-4.5c-1-1.1-2.7-1.7-4.4-1.7c-0.7,0-3.6,0.1-5.7,3v-2.5h-6.8V19h2.7v15.6h-1.8 h-0.9h-1.8V18.1h-6.8V19h2.9v15.6h-2.9v0.9H23h0.9h8.7v-0.9h-2.8v-7.4c0-3.2,0.1-5.7,2.1-7.4c0.8-0.6,1.8-1,2.7-1 c0.6,0,2.1,0.2,2.5,1.9c0.1,0.4,0.1,0.8,0.2,2.5v11.4h-2.7v0.9H44v-0.9h-2.8V23.8z"/>
                    </g>
                    <g>
                      <defs>
                        <rect id="SVGID_3_" width="111.4" height="48.5"/>
                      </defs>
                      <clipPath id="SVGID_4_">
                        <use xlink:href="#SVGID_3_" style="overflow:visible;"/>
                      </clipPath>
                      <path class="st2" d="M69.1,34.8c-1,0-1-1-1-2.5v-8.8c0-1.6,0-3-1.2-4.2c-1.1-1-3-1.7-5.1-1.7c-4.3,0-7,2.4-7,4.5 c0,1.1,0.7,2,1.9,2c1.1,0,1.9-0.9,1.9-1.8c0-1-0.9-1.5-0.9-2c0-0.6,1.6-1.8,3.5-1.8c2.8,0,2.9,2,3,3.2v4.2 c-1.6,0-3.9,0.2-5.7,0.7c-2.8,0.9-4.8,2.7-4.8,5.3c0,0.2,0,0.4,0,0.6c-0.2,0.8-0.6,2.2-2.5,2.2c-2.1,0-2.1-1.8-2.1-3.1V19h4.5 v-0.9h-4.5v-7h-0.6c-0.2,0.9-0.5,2.2-2.2,4.1c-1.1,1.3-2.3,2.5-3.9,3.2V19h2.7v10.7c0,2.2,0,3.1,0.3,3.9c0.6,1.7,2.3,2.5,4.4,2.5 c2.5,0,3.6-1.1,4.2-2.2c0.8,1.4,2.4,2.2,4.3,2.2c2.9,0,4.7-1.6,5.7-3.5c0.1,0.8,0.2,1.9,1.2,2.7c0.6,0.5,1.5,0.8,2.5,0.8 c1.8,0,2.7-1,3.2-1.4L70.4,34C70.1,34.3,69.7,34.8,69.1,34.8 M64.2,28.1c-0.1,2.2-0.2,3.6-1.5,4.9c-0.4,0.3-1.2,1-2.4,1 c-1.4,0-2.7-0.9-2.7-3c0-3.5,3.3-4.4,6.6-4.5V28.1z"/>
                    </g>
                    <g>
                      <defs>
                        <rect id="SVGID_5_" width="111.4" height="48.5"/>
                      </defs>
                      <clipPath id="SVGID_6_">
                        <use xlink:href="#SVGID_5_" style="overflow:visible;"/>
                      </clipPath>
                      <path class="st3" d="M79.5,35.1c-2.2,0-3.3-1.2-3.8-2.6c-0.4-1.2-0.4-2.8-0.4-4.2c0-1.9,0-5.8,0.7-7.4c0.8-2.1,2.6-2.4,3.8-2.4 c2.3,0,3.3,1.1,3.3,1.4c0,0.2-0.1,0.3-0.2,0.4c-0.3,0.3-0.8,1-0.8,2c0,1.1,0.8,2.2,2,2.2s2.2-1,2.2-2.4c0-2.1-2.4-4.6-6.3-4.6 c-5,0-9.2,3.9-9.2,9.4c0,5,3.8,9,8.7,9c4.6,0,6.8-3.2,7.4-6.2h-1.1C85.1,32.4,83,35.1,79.5,35.1"/>
                    </g>
                    <g>
                      <defs>
                        <rect id="SVGID_7_" width="111.4" height="48.5"/>
                      </defs>
                      <clipPath id="SVGID_8_">
                        <use xlink:href="#SVGID_7_" style="overflow:visible;"/>
                      </clipPath>
                      <path class="st4" d="M97.6,32.2c-0.1,0.7-0.4,2.4-2.5,2.4S93,32.8,93,31.5V19h4.5v-0.9H93v-7h-0.6c-0.2,0.9-0.5,2.2-2.2,4.1 c-1.1,1.3-2.3,2.5-3.9,3.2V19H89v10.7c0,2.2,0,3.1,0.3,3.9c0.6,1.7,2.3,2.5,4.4,2.5c3.9,0,4.5-2.7,4.7-3.8h-0.8V32.2z"/>
                    </g>
                    <g>
                      <defs>
                        <rect id="SVGID_9_" width="111.4" height="48.5"/>
                      </defs>
                      <clipPath id="SVGID_10_">
                        <use xlink:href="#SVGID_9_" style="overflow:visible;"/>
                      </clipPath>
                      <path class="st5" d="M18.8,14.4c1.6,0,2.9-1.3,2.9-2.9s-1.3-2.9-2.9-2.9s-2.9,1.3-2.9,2.9S17.2,14.4,18.8,14.4"/>
                    </g>
                  </g>
                </g>
              </svg>
              <div class="rp-meta">📍 Vancouver, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ <span class="company-name intact-name">Intact Financial</span></div>
              <div class="rp-meta">May 2024 – Aug 2024</div>
            </div>
            <div class="rp-tagline" style="--rotation: 2deg; --max-width: 300px;">GRC is NOT boring!</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo" src="logos/blackberry-black.png" alt="BlackBerry" loading="lazy">
              <div class="rp-meta">📍 Waterloo, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ BlackBerry</div>
              <div class="rp-meta">Jan 2024 – Apr 2024</div>
            </div>
            <div class="rp-tagline" style="--rotation: -1.8deg; --max-width: 300px;">Security architecture but not for the phones. </div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo" src="logos/cyberunit-black.png" alt="Cyber Unit" loading="lazy">
              <div class="rp-meta">📍 Vancouver, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ Cyber Unit</div>
              <div class="rp-meta">Oct 2021 – Aug 2022</div>
            </div>
            <div class="rp-tagline" style="--rotation: 2.2deg; --max-width: 300px;">My first ever exposure to the world of cybersecurity.</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo" src="logos/ubc-black.png" alt="UBC" loading="lazy">
              <div class="rp-meta">📍 Vancouver, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Cybersecurity Teaching Assistant @ UBC</div>
              <div class="rp-meta">Oct 2023 – Jan 2025</div>
            </div>
            <div class="rp-tagline" style="--rotation: -1.2deg; --max-width: 300px;">Taught some classes. Taught some labs. Graded A LOT of papers.</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo" src="logos/securityplus-black.png" alt="CompTIA Security+" loading="lazy">
              <div class="rp-meta">CompTIA Certification</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security+</div>
              <div class="rp-meta">Earned 2024</div>
            </div>
            <div class="rp-tagline" style="--rotation: 1.8deg; --max-width: 400px;">The tip of the iceberg for security certifications.</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo" src="logos/cc-black.png" alt="ISC2 CC" loading="lazy">
              <div class="rp-meta">ISC2 Certification</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Certified in Cybersecurity (CC)</div>
              <div class="rp-meta">Earned 2023</div>
            </div>
            <div class="rp-tagline" style="--rotation: -2.1deg; --max-width: 400px;">Everyone needs to start somewhere ... </div>
          </li>
        </ul>
      </div>
    `
  },

};
