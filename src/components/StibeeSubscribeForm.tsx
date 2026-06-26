import Script from "next/script";

export function StibeeSubscribeForm() {
  return (
    <div className="stibee-subscribe" id="stb_subscribe">
      <form
        action="https://stibee.com/api/v1.0/lists/3goibnDz9dwDZMbhlaBQvqiZxRND/public/subscribers"
        method="POST"
        target="_blank"
        acceptCharset="utf-8"
        className="stb_form"
        name="stb_subscribe_form"
        id="stb_subscribe_form"
        data-lang=""
        noValidate
      >
        <div className="stibee-fields">
          <fieldset className="stb_form_set">
            <label htmlFor="stb_email" className="stb_form_set_label">
              이메일 주소<span className="stb_asterisk">*</span>
            </label>
            <input type="text" className="stb_form_set_input" id="stb_email" name="email" required />
            <div className="stb_form_msg_error" id="stb_email_error" />
          </fieldset>

          <fieldset className="stb_form_set">
            <label htmlFor="stb_name" className="stb_form_set_label">
              이름
            </label>
            <input type="text" className="stb_form_set_input" id="stb_name" name="name" />
            <div className="stb_form_msg_error" id="stb_name_error" />
          </fieldset>
        </div>

        <div className="stibee-policies">
          <div className="stb_form_policy">
            <label>
              <input type="checkbox" id="stb_policy" value="stb_policy_true" />
              <span>(필수)</span>
              <button id="stb_form_modal_open" data-modal="stb_form_policy_modal" className="stb_form_modal_open_btn" type="button">
                개인정보 수집 및 이용
              </button>
              에 동의합니다.
            </label>
            <div className="stb_form_msg_error" id="stb_policy_error" />
            <div className="stb_form_modal stb_form_policy_text blind" id="stb_form_policy_modal">
              <div className="stb_form_modal_body">
                <h1 className="stb_form_modal_title">개인정보 수집 및 이용</h1>
                <div className="stb_form_modal_text">
                  뉴스레터 발송을 위한 최소한의 개인정보를 수집하고 이용합니다.
                  수집된 정보는 발송 외 다른 목적으로 이용되지 않으며, 서비스가 종료되거나 구독을 해지할 경우 즉시 파기됩니다.
                </div>
                <div className="stb_form_modal_btn">
                  <button id="stb_form_modal_close" className="stb_form_modal_close_btn" data-modal="stb_form_policy_modal" type="button">
                    닫기
                  </button>
                </div>
              </div>
              <div className="stb_form_modal_bg" id="stb_form_modal_bg" />
            </div>
          </div>

          <div className="stb_form_policy">
            <label>
              <input type="checkbox" id="stb_ad_agreement" value="stb_ad_agreement_true" />
              <span>(선택)</span>
              <button id="stb_form_ad_modal_open" data-modal="stb_form_ad_agreemnet_modal" className="stb_form_modal_open_btn" type="button">
                광고성 정보 수신
              </button>
              에 동의합니다.
            </label>
            <div className="stb_form_msg_error" id="stb_ad_agreement_error" />
            <div className="stb_form_modal stb_form_policy_text blind" id="stb_form_ad_agreemnet_modal">
              <div className="stb_form_modal_body">
                <h1 className="stb_form_modal_title">광고성 정보 수신</h1>
                <div className="stb_form_modal_text">제휴 콘텐츠, 프로모션, 이벤트 정보 등의 광고성 정보를 수신합니다.</div>
                <div className="stb_form_modal_btn">
                  <button id="stb_form_ad_modal_close" className="stb_form_modal_close_btn" data-modal="stb_form_ad_agreemnet_modal" type="button">
                    닫기
                  </button>
                </div>
              </div>
              <div className="stb_form_ad_modal_bg" id="stb_form_ad_modal_bg" />
            </div>
          </div>
        </div>

        <div className="stb_form_result" id="stb_form_result" />

        <fieldset className="stb_form_set_submit">
          <button type="submit" className="stb_form_submit_button" id="stb_form_submit_button">
            구독하기
          </button>
        </fieldset>
      </form>
      <Script src="https://resource.stibee.com/subscribe/stb_subscribe_form.js" strategy="afterInteractive" />
    </div>
  );
}
