import Layout from "../components/Layout";

export default function AdminPanel() {
  return (
    <Layout>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p>Hanya user dengan role admin yang bisa akses halaman ini (nanti bisa ditambah proteksi JWT).</p>
    </Layout>
  );
}
