import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import BlogPostForm from '../../../Components/BlogPostForm';

export default function Edit({ post }) {
    return (
        <AdminLayout>
            <BlogPostForm
                formTitle="Update"
                formAccent="Blog Post"
                submitLabel="Save Changes"
                processingLabel="Saving..."
                submitMethod="put"
                submitUrl={`/admin/blog/${post.slug}`}
                post={post}
            />
        </AdminLayout>
    );
}
