import React from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import BlogPostForm from '../../../Components/BlogPostForm';

export default function Create() {
    return (
        <AdminLayout>
            <BlogPostForm
                formTitle="Create"
                formAccent="Blog Post"
                submitLabel="Publish Post"
                processingLabel="Publishing..."
                submitMethod="post"
                submitUrl="/admin/blog"
            />
        </AdminLayout>
    );
}
