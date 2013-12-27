require 'stringex'

module Jekyll
  module SlugifyFilter

    String.send :include, Stringex::StringExtensions::PublicInstanceMethods
    String.send :extend, Stringex::StringExtensions::PublicClassMethods

    def slugify(input)
      input.to_url.split[0..1].join(" ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::SlugifyFilter)