require 'rake'
require 'stringex'

desc "Creates a new post"
task :new_post, :title do |t, args|
  puts "You didn't provide the title. So it will be created with the title 'new_post'" unless args.title

  args.with_defaults(:title => 'new-post')
  title = args.title

  puts "Creating a branch post/#{title.to_url}"
  system("git checkout -b post/#{title.to_url}")

  filename = "_posts/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.markdown"

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "author: Insert your name here"
    post.puts "comments: true"
    post.puts "categories:"
    post.puts "  - Tag1"
    post.puts "  - Tag2"
    post.puts "---"
    post.puts ""
    post.puts "Write your excerpt here"
    post.puts "<!--more-->"
    post.puts "Write full content here"
  end
end
