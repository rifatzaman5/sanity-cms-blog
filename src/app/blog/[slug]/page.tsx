import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";

// 1. Specific post ka data (author + category ke sath) lana
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    publishedAt,
    body,
    "authorName": author->name,
    "categoryTitle": categories[0]->title
  }`;

  // $slug yahan se ja raha hai
  const data = await client.fetch(query, { slug });
  return data;
}

// 2. Page Component
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return (
      <main style={{ padding: "50px" }}>
        <h1>Post not found!</h1>
        <p>Hum Sanity mein <strong>"{slug}"</strong> dhoondh rahe hain, par wo nahi mili.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "50px",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Hero image – static Unsplash URL */}
      <img
              src="https://images.unsplash.com/photo-1761850648640-2ee5870ee883?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
     alt={post.title}
        style={{
          width: "100%",
          height: "260px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      {/* Category chip */}
      {post.categoryTitle && (
        <span
          style={{
            display: "inline-block",
            background: "#f3f3f3",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          {post.categoryTitle}
        </span>
      )}

      {/* Title */}
      <h1 style={{ fontSize: "40px", margin: "5px 0 5px" }}>{post.title}</h1>

      {/* Author + Date */}
      <p
        style={{
          color: "gray",
          marginBottom: "30px",
          fontSize: "14px",
        }}
      >
        By {post.authorName || "Unknown"} —{" "}
        {new Date(post.publishedAt).toDateString()}
      </p>

      {/* Body */}
      <div style={{ fontSize: "18px", lineHeight: "1.7", color: "#333" }}>
        {post.body ? <PortableText value={post.body} /> : <p>No content available</p>}
      </div>
    </main>
  );
}