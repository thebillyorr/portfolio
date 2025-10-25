// content.js
export const CARD_CONTENT = {
  resume: {
    face: `
      <div class="resume-mini">
        <div class="resume-mini__title">Resume / Career</div>
        <ul class="resume-mini__bullets">
          <li>Microsoft · SAP · Intact · BlackBerry</li>
          <li>Security · AI · GRC · Cloud</li>
        </ul>
      </div>
    `,
    modal: `
      <div class="rp">
        <header class="rp-header">
          <h2 class="rp-title">Billy Orr</h2>
          <p class="rp-sub">Security Engineer · Offensive Research · AI + Cloud</p>
        </header>

        <nav class="rp-menu" role="tablist" aria-label="Resume sections">
          <button class="active" role="tab" aria-selected="true" data-target="experience">Experience</button>
          <button role="tab" aria-selected="false" data-target="certifications">Certifications</button>
        </nav>

        <div class="rp-sections">
          <ul id="rp-experience" class="rp-section active" role="tabpanel" aria-labelledby="experience">
            <li class="rp-item">
              <img class="rp-logo" src="images/microsoft.png" alt="Microsoft" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security Program Manager Intern</div>
                <div class="rp-meta"><i>Microsoft · Redmond, WA</i></div>
                <div class="rp-meta"><i>May 2025 – Aug 2025</i></div>
              </div>
            </li><hr class="rp-hr"/>

            <li class="rp-item">
              <img class="rp-logo" src="images/sap.png" alt="SAP" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security Engineer Intern</div>
                <div class="rp-meta"><i>SAP · Vancouver, BC</i></div>
                <div class="rp-meta"><i>Sep 2024 – Apr 2025</i></div>
              </div>
            </li><hr class="rp-hr"/>

            <li class="rp-item">
              <img class="rp-logo" src="images/intact.png" alt="Intact Financial" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security Risk Intern</div>
                <div class="rp-meta"><i>Intact Financial · Vancouver, BC</i></div>
                <div class="rp-meta"><i>May 2024 – Aug 2024</i></div>
              </div>
            </li><hr class="rp-hr"/>

            <li class="rp-item">
              <img class="rp-logo" src="images/blackberry.png" alt="BlackBerry" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security Architecture Intern</div>
                <div class="rp-meta"><i>BlackBerry · Waterloo, ON</i></div>
                <div class="rp-meta"><i>Jan 2024 – Apr 2024</i></div>
              </div>
            </li><hr class="rp-hr"/>

            <li class="rp-item">
              <img class="rp-logo" src="images/cyberunit.png" alt="Cyber Unit" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security Operations Intern</div>
                <div class="rp-meta"><i>Cyber Unit · Vancouver, BC</i></div>
                <div class="rp-meta"><i>Oct 2021 – Aug 2022</i></div>
              </div>
            </li>
          </ul>

          <ul id="rp-certifications" class="rp-section" role="tabpanel" aria-labelledby="certifications">
            <li class="rp-item">
              <img class="rp-logo" src="images/securityplus.png" alt="CompTIA Security+" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">Security+</div>
                <div class="rp-meta"><i>CompTIA</i></div>
              </div>
            </li><hr class="rp-hr"/>

            <li class="rp-item">
              <img class="rp-logo" src="images/cc.png" alt="ISC2 CC" loading="lazy">
              <div class="rp-job">
                <div class="rp-role">CC</div>
                <div class="rp-meta"><i>ISC2</i></div>
              </div>
            </li>
            <li class="rp-spacer"></li>
          </ul>
        </div>
      </div>
    `
  },

};
