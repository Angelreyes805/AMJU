// UI-only contact form. Submissions are intentionally non-functional until a
// backend/form endpoint is connected (see the store data-layer seam pattern).

export default function ContactForm() {
  return (
    <form className="form" aria-label="Contact form">
      <div className="form__row">
        <label className="form__field">
          <span className="form__label">Name</span>
          <input className="form__input" type="text" name="name" autoComplete="name" />
        </label>
        <label className="form__field">
          <span className="form__label">Email</span>
          <input className="form__input" type="email" name="email" autoComplete="email" />
        </label>
      </div>
      <label className="form__field">
        <span className="form__label">Subject</span>
        <input className="form__input" type="text" name="subject" />
      </label>
      <label className="form__field">
        <span className="form__label">Message</span>
        <textarea className="form__input form__input--textarea" name="message" rows={6} />
      </label>
      <button type="submit" className="btn btn--primary btn--lg" disabled>
        Send Message
      </button>
      <p className="form__note">
        This form is a preview — messaging is enabled once the site’s form
        service is connected.
      </p>
    </form>
  );
}
