import { client } from "@/sanity/lib/client";
import Link from "next/link";

// 1. Sanity se posts + author + category lana
async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "authorName": author->name,
    "categoryTitle": categories[0]->title
  }`;
  
  const data = await client.fetch(query);
  return data;
}

// 2. Home Page Component
export default async function Home() {
  const posts = await getPosts(); // upar wala function call

  return (
    <main style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Welcome to My Blog</h1>
      <p>Niche meri latest posts hain:</p>

      <div style={{ marginTop: "30px", display: "grid", gap: "20px" }}>
        {posts.map((post: any) => (
          <article
            key={post._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              maxWidth: "600px",
            }}
          >
            {/* Simple static image from Unsplash */}
            <img
              src="https://images.unsplash.com/photo-1761850648640-2ee5870ee883?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
              alt={post.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            <div style={{ padding: "20px" }}>
              {/* Category tag */}
              {post.categoryTitle && (
                <span
                  style={{
                    display: "inline-block",
                    background: "#f3f3f3",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {post.categoryTitle}
                </span>
              )}

              <h2 style={{ margin: "8px 0" }}>{post.title}</h2>

              {/* Author + Date */}
              <p style={{ margin: "0 0 10px", color: "gray", fontSize: "14px" }}>
                By {post.authorName || "Unknown"} —{" "}
                {new Date(post.publishedAt).toDateString()}
              </p>

              <Link
                href={`/blog/${post.slug.current}`}
                style={{ color: "blue", textDecoration: "underline", fontSize: "14px" }}
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}