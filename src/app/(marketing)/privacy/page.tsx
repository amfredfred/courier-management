import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SwiftTrack",
};

export default function PrivacyPage() {
  return (
    <div className="st-legal">
      <p className="st-legal-eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p className="st-legal-updated">Last updated January 1, 2026</p>

      <h2>1. Information we collect</h2>
      <p>
        To provide shipment tracking, we collect sender and receiver names, email addresses,
        phone numbers, and delivery addresses, along with shipment details such as weight,
        dimensions, and status history. Administrative accounts additionally provide a login
        email and password, managed through our authentication provider.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>To generate and update shipment tracking records and their timeline.</li>
        <li>To send email notifications when a shipment&apos;s status changes.</li>
        <li>To display shipment status on the public tracking page to anyone with the tracking ID.</li>
        <li>To let authorized staff manage shipments through the operations dashboard.</li>
      </ul>

      <h2>3. Attachments</h2>
      <p>
        Files attached to a shipment (such as delivery photos) are stored in our file storage
        provider and linked to that shipment&apos;s record. They are accessible via the same
        access controls as the shipment itself.
      </p>

      <h2>4. Who can see your information</h2>
      <p>
        Shipment status and timeline are visible on the public tracking page to anyone who enters
        the correct tracking ID. Full shipment details, including contact information, are only
        visible to authenticated administrative users.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Shipment records are retained for as long as needed for operational and record-keeping
        purposes. Administrators may delete a shipment and its associated data at any time from
        the dashboard.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        We use Supabase for authentication, database, and file storage, and an email delivery
        provider to send status notifications. These providers process data solely to support
        the functionality described above.
      </p>

      <h2>7. Your choices</h2>
      <p>
        Senders can opt out of sending notification emails for a given status update from the
        dashboard. To request removal of your information from a shipment record, contact us
        using the details below.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected
        by updating the date at the top of this page.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy or your data can be sent to{" "}
        <a href="mailto:support@swifttrack.app">support@swifttrack.app</a>.
      </p>
    </div>
  );
}
