import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { BlogPost } from "@/types/type";
import { useFetch } from "@/lib/fetch";

const Blog = ({ id }: { id: string }) => {
  const {
    data: blogsResponse,
    loading,
    error,
  } = useFetch<{ data: BlogPost[] }>(`/(api)/blogs/${id}`);

  const blogs = blogsResponse?.data || [];

  if (loading) {
    return (
      <View className="px-5 mb-8">
        <Text className="text-2xl font-JakartaBold text-white mb-4">
          Blog Posts
        </Text>
        <View className="flex items-center justify-center p-4">
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-5 mb-8">
        <Text className="text-2xl font-JakartaBold text-white mb-4">
          Blog Posts
        </Text>
        <View className="bg-main-secondarybg rounded-lg p-4">
          <Text className="text-gray-300 font-JakartaMedium text-center">
            Failed to load blog posts
          </Text>
        </View>
      </View>
    );
  }

  if (!blogs.length) {
    return (
      <View className="px-5 mb-8">
        <Text className="text-2xl font-JakartaBold text-white mb-4">
          Blog Posts
        </Text>
        <View className="bg-main-secondarybg rounded-lg p-4">
          <Text className="text-gray-300 font-JakartaMedium text-center">
            No blog posts yet
          </Text>
        </View>
      </View>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "event":
        return "bg-blue-500";
      case "request donation":
        return "bg-green-500";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <View className="px-5 mb-8">
      <Text className="text-2xl font-JakartaBold text-white mb-4">
        Blog Posts
      </Text>
      <ScrollView className="space-y-4">
        {blogs.map((post) => (
          <View
            key={post.id}
            className="bg-main-secondarybg rounded-lg p-4 space-y-2"
          >
            {/* Type Badge */}
            <View
              className={`self-start rounded-full px-3 py-1 ${getTypeColor(
                post.type
              )}`}
            >
              <Text className="text-white font-JakartaMedium text-sm">
                {post.type}
              </Text>
            </View>

            {/* Content */}
            <Text className="text-gray-300 font-JakartaMedium">
              {post.content}
            </Text>

            {/* Date */}
            <Text className="text-gray-400 font-JakartaMedium text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Blog;
