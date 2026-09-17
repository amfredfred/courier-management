import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SwiftTrack",
};

export default function TermsPage() {
  return (
    <div className="st-legal">
      <p className="st-legal-eyebrow">Legal</p>
      <h1>Terms of Service</h1>
      <p className="st-legal-updated">Last updated January 1, 2026</p>

      <h2>1. Acceptance of terms</h2>
      <p>
        By accessing or using SwiftTrack&apos;s public tracking page or administrative dashboard,
        you agree to be bound by these Terms of Service. If you do not agree, do not use the
        service.
      </p>

      <h2>2. Description of service</h2>
      <p>
        SwiftTrack provides shipment tracking and courier operations tools, including a public
        tracking lookup by tracking ID and an access-controlled dashboard for creating and managing
        shipments.
      </p>

      <h2>3. Use of the public tracking page</h2>
      <p>
        The public tracking page displays shipment status to anyone who supplies a valid tracking
        ID. No account is required. You are responsible for keeping your tracking ID confidential
        if you do not want others to view your shipment&apos;s status.
      </p>

      <h2>4. Administrative accounts</h2>
      <p>
        Access to the operations dashboard is granted to authorized personnel only. Account holders
        are responsible for maintaining the confidentiality of their login credentials and for all
        activity under their account.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not attempt to access shipments or accounts that are not yours.</li>
        <li>Do not use automated tools to scrape or bulk-query the tracking page.</li>
        <li>Do not upload unlawful, infringing, or harmful content as shipment attachments.</li>
      </ul>

      <h2>6. Service availability</h2>
      <p>
        SwiftTrack is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not
        guarantee uninterrupted access and may modify or discontinue features at any time.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        SwiftTrack is not liable for indirect, incidental, or consequential damages arising from
        use of the service, including delays or inaccuracies in shipment status information.
      </p>

      <h2>8. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the service after changes
        are posted constitutes acceptance of the revised Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href="mailto:support@swifttrack.app">support@swifttrack.app</a>.
      </p>
    </div>
  );
}
