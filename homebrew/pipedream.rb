class Pipedream < Formula
    desc "CLI utility for Pipedream"
    homepage "https://pipedream.com"
    url "https://cli.pipedream.com/darwin/amd64/0.2.5/pd.zip"
    sha256 "bd1a23ce2428c0c2e35eb80cf69a6069f70d11f1389a9656a27f8a7c1bdf5f9f"
  
    def install
      bin.install "pd"
    end
  
    def caveats; <<~EOS
      ❤ Thanks for installing the Pipedream CLI! If this is your first time using the CLI, be sure to run `pd login` first.
    EOS
    end
  
    test do
      system "#{bin}/pd", "--version"
    end
  end
  