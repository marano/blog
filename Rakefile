require 'rake'
require 'stringex'
require 'i18n'

desc "Creates a new post"
task :new_post, :title do |t, args|
  
  title = post_title(args)
  author = author_name

  STDOUT.puts "Tags: (Optional. Separate with commas)"
  tags = STDIN.gets.strip

  puts "Creating a branch post/#{title.to_url}"
  system("git checkout -b post/#{title.to_url}")

  filename = "_posts/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.markdown"

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "author: #{author}"
    post.puts "categories:"
    unless tags.empty?
      tags.split(',').each do | tag |
        post.puts "  - #{tag.strip}"
      end
    else
      post.puts "  - Tag1"
      post.puts "  - Tag2"
    end
    post.puts "---"
    post.puts ""
    post.puts "Write your excerpt here"
    post.puts "<!--more-->"
    post.puts "Write full content here"
  end
end

desc "Fix the author link of posts from people that are no longer on the team"
task :fix_author_links do
  require 'jekyll'

  config = Jekyll.configuration({})
  site   = Jekyll::Site.new(config)
  site.read
  site.posts.each do |post|
    author = post.data['author']

    # Skip posts that have the author set to the site default
    next if author == nil

    # Skip posts for members that we already know that are no longer on the team
    next if post.data['hide_author_link']

    unless team_names.include?(I18n.transliterate(author))
      print "Changing #{post.path} to hide the author link (#{author})... "

      post_contents = File.read(post.path).force_encoding('utf-8')
      post_contents.gsub!(/^(author: #{author})$/, "\\1\nhide_author_link: true")
      open(post.path, 'w') do |file|
        file.print(post_contents)
      end
      puts 'DONE!'
    end
  end
end

def team_names
  require 'open-uri'
  require 'json'
  team = JSON.parse(open('http://helabs.com.br/team.json').read)['team']
  team_names = team.map { |member| I18n.transliterate(member['full_name']) }
end

def author_name
  authors = team_names.sort
  authors.each_with_index do |author, i|
    puts "#{i} - #{author}"
  end

  STDOUT.puts "Author name. Choose a number from 0 to #{ team_names.size - 1 }: (Required)"
  input = STDIN.gets.strip
  
  return authors[input.to_i] if authors[input.to_i]
  author_name
end

def post_title(args)
  return args.title if args.title
  puts "You didn't provide the title. You can do it now or just press ENTER to created with the title 'new_post'"
  post_title = STDIN.gets.strip
  post_title.empty? ? 'new-post' : post_title
end