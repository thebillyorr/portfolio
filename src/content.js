// content.js
export const CARD_CONTENT = {
  resume: {
    small: `
      <div class="card-display-small">
        <div>
          <span class="card-emoji">📄</span>
          <span class="card-label-small">Resume</span>
        </div>
      </div>
    `,
    medium: `
      <div class="card-display-medium">
        <div class="medium-left">
          <span class="card-emoji">📄</span>
          <span class="card-label">Resume</span>
        </div>
        <div class="medium-right">
          <span class="card-cta">Click to view my experiences</span>
        </div>
      </div>
    `,
    large: `
      <div class="card-display-large">
        <div class="large-top">
          <span class="card-emoji">📄</span>
          <h3 class="card-title">Resume</h3>
        </div>
        <div class="large-bottom">
          <div class="company-grid">
            <div class="company-logo">
              <img src="logos/microsoft.svg" alt="Microsoft" />
            </div>
            <div class="company-logo">
              <img src="logos/sap.svg" alt="SAP" />
            </div>
            <div class="company-logo">
              <img src="logos/intact.svg" alt="Intact" />
            </div>
            <div class="company-logo">
              <img src="logos/blackberry.svg" alt="BlackBerry" />
            </div>
          </div>
        </div>
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
            <div class="rp-tagline" style="--rotation: 2deg; --max-width: 200px;">"AI. ML. RAG. MCP. LLMs. Did it all."</div>
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
            <div class="rp-tagline" style="--rotation: -2.5deg; --max-width: 400px;">"Physical Security. 100+ offices worldwide. Yes we were busy."</div>
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
            <div class="rp-tagline" style="--rotation: 2deg; --max-width: 300px;">"GRC is NOT boring!"</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <svg class="rp-logo blackberry" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="26.986015" width="38.875896" viewBox="0 0 38.875896 26.986015">
                <defs>
                  <linearGradient id="blackberryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1172db"/>
                    <stop offset="100%" stop-color="#01033e"/>
                  </linearGradient>
                </defs>
                <g clip-path="url(#clipPath3355)" transform="translate(-4.1840024,-9.0407543)">
                  <path d="m 16.451,11.896 c 0,-1.264 -0.774,-2.864 -4.027,-2.864 -1.335,0 -5.009,0 -5.009,0 L 5.991,15.62 c 0,0 2.707,0 5.222,0 4.077,0 5.238,-1.93 5.238,-3.724 z"/>
                  <path d="m 29.944,11.896 c 0,-1.264 -0.772,-2.864 -4.024,-2.864 -1.336,0 -5.01,0 -5.01,0 l -1.423,6.587 c 0,0 2.706,0 5.219,0 4.079,10e-4 5.238,-1.929 5.238,-3.723 z"/>
                  <path d="m 14.644,21.811 c 0,-1.264 -0.774,-2.868 -4.027,-2.868 -1.335,0 -5.009,0 -5.009,0 l -1.424,6.592 c 0,0 2.707,0 5.22,0 4.078,0 5.24,-1.935 5.24,-3.724 z"/>
                  <path d="m 28.137,21.811 c 0,-1.264 -0.775,-2.868 -4.025,-2.868 -1.337,0 -5.009,0 -5.009,0 l -1.426,6.592 c 0,0 2.707,0 5.222,0 4.079,0 5.238,-1.935 5.238,-3.724 z"/>
                  <path d="m 42.254,17.79 c 0,-1.265 -0.775,-2.868 -4.025,-2.868 -1.337,0 -5.009,0 -5.009,0 l -1.426,6.591 c 0,0 2.709,0 5.22,0 4.079,0 5.24,-1.93 5.24,-3.723 z"/>
                  <path d="m 40.308,28.113 c 0,-1.265 -0.773,-2.864 -4.025,-2.864 -1.335,0 -5.009,0 -5.009,0 l -1.424,6.588 c 0,0 2.705,0 5.22,0 4.078,0 5.238,-1.935 5.238,-3.724 z"/>
                  <path d="m 26.198,32.135 c 0,-1.27 -0.772,-2.873 -4.022,-2.873 -1.338,0 -5.012,0 -5.012,0 l -1.424,6.591 c 0,0 2.707,0 5.22,0 4.079,10e-4 5.238,-1.929 5.238,-3.718 z"/>
                </g>
              </svg>
              <div class="rp-meta">📍 Waterloo, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ <span class="company-name blackberry-name">BlackBerry</span></div>
              <div class="rp-meta">Jan 2024 – Apr 2024</div>
            </div>
            <div class="rp-tagline" style="--rotation: -1.8deg; --max-width: 300px;">"Security architecture but not for the phones."</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo cyberunit" src="logos/cyberunit.png" alt="Cyber Unit" />
              <div class="rp-meta">📍 Vancouver, CAN</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security Engineer Intern @ <span class="company-name cyberunit-name">Cyber Unit</span></div>
              <div class="rp-meta">Oct 2021 – Aug 2022</div>
            </div>
            <div class="rp-tagline" style="--rotation: 2.2deg; --max-width: 300px;">"My first ever exposure to the world of cybersecurity."</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <svg class="rp-logo ubc" xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 192.756 192.756">
                <g fill-rule="evenodd" clip-rule="evenodd">
                  <path fill="#fff" fill-opacity="0" d="M0 0h192.756v192.756H0V0z"/>
                  <path d="M145.656 26.548l-1.326 4.861h-.441c-1.326-1.326-2.693-2.544-3.977-3.094-1.818-.777-3.094-1.326-4.863-1.326-3.535 0-6.188 1.326-8.838 4.419-2.652 3.094-3.979 6.63-3.979 10.607s1.189 7.176 3.535 10.165c2.518 3.203 5.746 4.861 9.281 4.861 1.77 0 3.045-.548 4.863-1.326 1.283-.55 2.65-1.326 4.418-2.21h.885l-.885 4.42c-1.768.884-3.549 1.106-5.303 1.326-1.809.225-3.535.442-5.746.442-4.861 0-8.852-.868-12.375-3.094-4.871-3.076-7.07-7.955-7.07-14.584 0-5.304 2.1-9.853 6.188-13.259 3.869-3.226 8.838-4.862 14.584-4.862 1.768 0 3.535 0 5.305.442 1.768.444 3.535 1.329 5.744 2.212zM78.921 46.878c0 3.534-1.224 6.739-3.978 9.281-2.993 2.763-6.629 3.978-11.049 3.978-3.978 0-7.514-.884-11.049-2.651-3.536-1.768-5.304-3.978-5.304-7.072V24.338h7.955v23.424c0 2.65.755 4.526 2.21 6.188 1.646 1.881 3.536 2.652 6.188 2.652h.884c2.21 0 4.595-.628 6.629-2.209 1.973-1.535 3.094-3.536 3.094-5.746V24.338h4.42v22.54zM47.542 75.164c7.071 0 7.955-3.535 16.353-3.535s9.723 3.535 16.353 3.535c7.071 0 7.955-3.535 16.353-3.535 8.397 0 9.723 3.535 16.352 3.535 6.631 0 7.955-3.535 16.354-3.535 8.396 0 9.281 3.535 16.352 3.535v-7.955c-7.07 0-7.955-3.535-16.352-3.535-8.398 0-9.723 3.535-16.354 3.535-6.629 0-7.955-3.535-16.352-3.535s-9.281 3.535-16.353 3.535c-6.629 0-7.955-3.535-16.353-3.535s-9.281 3.535-16.353 3.535v7.955z" fill="#22276c"/>
                  <path d="M96.599 165.766c30.938-9.723 38.45-26.959 48.616-48.615l-22.541 16.354 12.818-28.729-20.773 22.982 9.725-35.357-16.354 29.17 4.42-36.683-12.375 32.705-3.536-41.103-3.978 41.102-12.374-32.705 4.861 36.683L68.313 92.4l10.165 35.357-21.214-22.982 12.817 28.729-22.098-16.354c10.165 21.657 17.237 38.893 48.616 48.616z" fill="#d2b22c"/>
                  <path d="M47.542 101.24c7.071 0 7.955-3.094 16.353-3.094h3.978l-2.21-7.956h-1.768c-8.397 0-9.281 3.535-16.353 3.094v7.956zm27.843-.885c1.326.441 3.094.885 4.862.885h.442l-1.326-7.956c-3.978 0-6.188-1.326-9.723-2.652l5.745 9.723zm12.817-.882c1.326-.443 2.652-.885 4.42-1.326l.442-7.956c-3.094.884-5.304 1.768-7.513 2.651l2.651 6.631zm12.374-1.327c1.77.441 3.094.883 4.42 1.326l2.652-7.072c-2.652-.442-4.42-1.768-7.955-2.209l.883 7.955zm11.934 3.094h.441c1.768 0 3.537 0 4.861-.443l5.305-9.722c-3.535.884-5.305 2.21-9.723 2.21l-.884 7.955zm12.375-3.094h4.42c8.396 0 9.281 3.094 16.352 3.094v-7.956c-7.07 0-7.955-3.094-16.352-3.094h-1.768l-2.652 7.956zM47.542 87.981c7.071 0 7.955-3.094 16.353-3.094 7.955 0 9.281 2.651 15.027 3.094l-.884-7.955c-4.861-.442-6.629-3.094-14.143-3.094-8.397 0-9.281 3.535-16.353 3.535v7.514zm36.24 0c3.536-.884 5.304-2.652 9.723-3.094l.884-7.955c-6.188.884-7.955 3.094-13.259 3.535l2.652 7.514zm15.47-3.094c4.861.442 6.629 2.21 10.164 3.094l2.652-7.514c-5.305-.441-7.072-3.094-13.701-3.535l.885 7.955zm15.025 3.094c5.746 0 7.072-3.094 15.027-3.094 8.396 0 9.281 3.094 16.352 3.094v-7.955c-7.07 0-7.955-3.094-16.352-3.094-7.514 0-9.281 2.651-14.143 3.094l-.884 7.955z" fill="#22276c"/>
                  <path d="M96.599 178.582c11.932-3.535 24.307-8.396 34.473-16.793 7.07-5.746 13.258-12.818 17.236-20.773 6.188-11.49 8.396-23.865 8.396-37.125V14.173H36.05v89.717c.442 13.26 2.21 25.635 8.397 37.125 3.978 7.955 10.165 15.027 17.236 20.773 10.166 8.398 22.541 13.259 34.916 16.794zM38.703 16.825v87.065c0 36.242 20.33 61.875 57.896 72.041 37.125-10.166 57.897-35.799 57.897-72.041V16.825H38.703z" fill="#22276c"/>
                  <path d="M95.715 42.459h-4.42v14.143h3.978c4.031 0 6.629-2.777 6.629-7.071 0-3.476-2.955-7.072-6.187-7.072zm.884 16.794H83.782V24.78h16.794c2.652 0 5.305.884 7.072 2.21 1.768 1.768 3.094 3.536 3.094 5.746 0 1.768-1.326 3.536-3.094 4.861-2.209 1.768-4.42 2.652-7.072 3.094v.442c3.094 0 5.746.442 7.955 2.209 1.77 1.326 3.094 3.094 3.094 5.746s-1.324 5.304-3.535 7.071c-2.209 2.21-5.303 3.094-8.838 3.094h-2.653zm-2.21-31.821h-3.094v12.375h3.978c3.291 0 6.188-2.809 6.188-6.629 0-3.822-3.955-5.746-7.072-5.746z" fill="#22276c"/>
                </g>
              </svg>
              <div class="rp-meta">📍 University of British Columbia</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Cybersecurity Teaching Assistant @ <span class="company-name ubc-name">UBC</span></div>
              <div class="rp-meta">Oct 2023 – Jan 2025</div>
            </div>
            <div class="rp-tagline" style="--rotation: -1.2deg; --max-width: 300px;">"Taught some classes. Taught some labs. Graded A LOT of papers."</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo security-plus" src="logos/securityplus-black.png" alt="CompTIA Security+" loading="lazy">
              <div class="rp-meta">CompTIA Security+</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Security+</div>
              <div class="rp-meta">Earned 2024</div>
            </div>
            <div class="rp-tagline" style="--rotation: 1.8deg; --max-width: 400px;">"The tip of the iceberg for security certifications."</div>
          </li>

          <li class="rp-item">
            <div class="rp-logo-section">
              <img class="rp-logo cc" src="logos/cc-black.png" alt="ISC2 CC" loading="lazy">
              <div class="rp-meta">ISC2 Certified in Cybersecurity</div>
            </div>
            <div class="rp-job">
              <div class="rp-role">Certified in Cybersecurity (CC)</div>
              <div class="rp-meta">Earned 2023</div>
            </div>
            <div class="rp-tagline" style="--rotation: -2.1deg; --max-width: 400px;">"Everyone needs to start somewhere ... "</div>
          </li>
        </ul>
      </div>
    `
  },

};
