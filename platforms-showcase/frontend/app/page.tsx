import Image from "next/image";

import { HomeLandingCoverImg } from "@app/styles/assets";
import "@app/styles/homepage.scss";

export default function Home(): React.ReactElement {
  return (
    <main>
      <div className="homepage__top-cover position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="d-flex justify-content-center">
            <Image
              className="homepage-top-cover__center-logo"
              alt="ShineYup - Logo"
              src="/main-logo-with-text-shineyup.png"
              width="350"
              height="122" />
          </div>
        </div>

        <Image
          className="homepage__top-cover-bg-img position-absolute top-0 start-0"
          alt="ShineYup - Home Cover"
          src={ HomeLandingCoverImg }
          width="1920"
          height="1050" />
      </div>
    </main>
  );
}
