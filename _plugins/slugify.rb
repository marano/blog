require 'stringex'

module Jekyll
  module SlugifyFilter
    def slugify(input)
      input.to_url.split[0..1].join(" ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::SlugifyFilter)