import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Members Area"
        title="Members"
        subtitle="Sign in to manage your account, track orders, and access members-only content."
      />
      <section className="section">
        <div className="u-container">
          <div className="placeholder">
            <h2 className="placeholder__title">Member accounts coming soon</h2>
            <p className="placeholder__text">
              Account sign-in and profiles will be available once the members
              area is connected.
            </p>
            <div className="placeholder__actions">
              <button className="btn btn--primary btn--lg" type="button" disabled>
                Log In
              </button>
              <button className="btn btn--outline btn--lg" type="button" disabled>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
