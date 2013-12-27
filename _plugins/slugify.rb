require 'stringex'

module Jekyll
  module SlugifyFilter
    def to_url(input)
      input.to_url.split[0..1].join(" ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::SlugifyFilter)