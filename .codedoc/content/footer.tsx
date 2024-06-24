import { ThemedComponentThis, themedStyle } from "@connectv/jss-theme";
import { CodedocConfig, CodedocTheme } from "@codedoc/core";
import { FooterStyle, DarkModeSwitch$, ToCToggle$ } from "@codedoc/core/components";

const _FooterStyle = themedStyle((theme: CodedocTheme) => {
  const parent = FooterStyle.style(theme); // --> get the style for original footer
  return {
    footer: {
      extend: parent.footer, // --> simply extend them
      "& svg": { fill: theme.light.text },
      "&": { boxShadow: "none" },
      "& .main": { textAlign: "center" },
      "body.dark & svg": { fill: theme.dark.text },
      "@media screen and (min-width: 1200px)": {
        // --> and make the left corner of the footer disappear on desktops
        "& .left": { opacity: 0 },
      },
    },
  } as any;
});

export function Footer(this: ThemedComponentThis, config: CodedocConfig, renderer: any) {
  const classes = this.theme.classes(_FooterStyle);
  return (
    <div class={classes.footer}>
      {/* --> the toggle is included, but hidden on desktop via css */}
      <div class="main">
        <div class="inside">
          <a href={`https://discord.gg/ed9VWDnrh7`} target="_blank">
            <svg fill="{theme.light.background}" width="18" height="18" xmlns="http://www.w3.org/2000/svg" class="bi bi-discord" viewBox="0 0 16 16">
              <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
            </svg>
          </a>
          <span style="margin:0 10px"> </span>
          <a href={`https://github.com/cashfree`} target="_blank">
            <svg fill="{theme.light.background}" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
              <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
            </svg>
          </a>
          <span style="margin:0 10px"> </span>
          <a href="https://www.linkedin.com/showcase/cashfree-engineering/" target="_blank">
            <svg
              fill="{theme.light.background}"
              width="18"
              height="18"
              viewBox="-2 -2 24 24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin"
              class="jam jam-linkedin"
            >
              <path d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z" />
            </svg>
          </a>
          <span style="margin:0 10px"> </span>
          <a href="https://twitter.com/gocashfree" target="_blank">
            <svg fill="{theme.light.background}" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
              <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
            </svg>
          </a>
        </div>
      </div>
      <div class="right">
        <DarkModeSwitch$ />
      </div>{" "}
      {/* --> also do not forget the dark mode switch. */}
    </div>
  );
}
